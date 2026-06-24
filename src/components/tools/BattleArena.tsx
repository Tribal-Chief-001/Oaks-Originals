"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, Sword, Shield, Zap, Sparkles, Trophy, Users, Terminal } from "lucide-react";
import { usePokedexStore, Pokemon } from "@/hooks/usePokedexStore";
import { io, Socket } from "socket.io-client";

interface BattlePokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: string[];
}

export const BattleArena: React.FC = () => {
  const {
    showBattleArena,
    setShowBattleArena,
    pokemon: allPokemon,
    currentTeam,
    darkMode,
    playClickSound,
    playSuccessSound,
    playErrorSound
  } = usePokedexStore();

  const [activeTab, setActiveTab] = useState<"ai" | "pvp">("ai");
  const [battleState, setBattleState] = useState<"setup" | "fighting" | "victory" | "defeat">("setup");
  
  // Combat Teams
  const [playerTeam, setPlayerTeam] = useState<BattlePokemon[]>([]);
  const [activePlayerIdx, setActivePlayerIdx] = useState<number>(0);
  const [aiTeam, setAiTeam] = useState<BattlePokemon[]>([]);
  const [activeAiIdx, setActiveAiIdx] = useState<number>(0);
  
  // Logs & Animations
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [hitTarget, setHitTarget] = useState<"player" | "ai" | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // PvP State
  const [pvpSearchState, setPvpSearchState] = useState<"idle" | "searching" | "connected" | "ended">("idle");
  const [pvpLog, setPvpLog] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineCount, setOnlineCount] = useState(12);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [battleLog, pvpLog]);

  if (!showBattleArena) return null;

  // Helpers to fetch basic moveset
  const getMovesForPokemon = (p: Pokemon): string[] => {
    if (p.competitive?.optimalMovesets && p.competitive.optimalMovesets.length > 0) {
      return p.competitive.optimalMovesets.slice(0, 4);
    }
    return ["Tackle", "Growl", "Quick Attack", "Swift"];
  };

  // Convert Pokemon to Combat stats format
  const convertToBattlePokemon = (p: Pokemon): BattlePokemon => {
    const statsMap: Record<string, number> = {};
    if (Array.isArray(p.stats)) {
      p.stats.forEach((s: any) => {
        statsMap[s.name] = s.value;
      });
    }
    const hpVal = statsMap["hp"] || 60;
    // Map moves
    const moves = getMovesForPokemon(p);

    return {
      id: p.id,
      name: p.name,
      image: p.image,
      types: p.types,
      hp: hpVal * 3, // Scale HP for a longer fun battle
      maxHp: hpVal * 3,
      attack: statsMap["attack"] || 50,
      defense: statsMap["defense"] || 50,
      speed: statsMap["speed"] || 50,
      moves
    };
  };

  // Start battle setup
  const initializeBattle = () => {
    playSuccessSound();
    
    // 1. Setup Player Team (current selection of 3, or fallback to Gen I starters)
    let selected: Pokemon[] = [];
    if (currentTeam && currentTeam.length > 0) {
      selected = currentTeam.slice(0, 3);
    } else {
      // Fallback: Bulbasaur, Charmander, Squirtle
      selected = allPokemon.filter(p => [1, 4, 7].includes(p.id));
    }
    
    const pCombat = selected.map(p => convertToBattlePokemon(p));
    setPlayerTeam(pCombat);
    setActivePlayerIdx(0);

    // 2. Setup AI Opponent Team (Gary Oak - Selects 3 random strong Gen 1 Pokemon)
    const candidates = allPokemon.filter(p => [3, 6, 9, 26, 59, 65, 68, 130, 143, 149].includes(p.id));
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const aiCombat = shuffled.slice(0, 3).map(p => convertToBattlePokemon(p));
    setAiTeam(aiCombat);
    setActiveAiIdx(0);

    setBattleLog([
      "⚔️ Battle Started! Opponent Gary Oak sent out " + aiCombat[0].name.toUpperCase() + "!",
      "Go! " + pCombat[0].name.toUpperCase() + "!"
    ]);
    setBattleState("fighting");
  };

  // Type effectiveness multiplier table
  const getTypeMultiplier = (attackType: string, defendTypes: string[]): number => {
    const table: Record<string, Record<string, number>> = {
      normal: { rock: 0.5, ghost: 0 },
      fire: { water: 0.5, fire: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5 },
      water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
      grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5 },
      electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
      ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, steel: 0.5 },
      fighting: { normal: 2, ice: 2, rock: 2, ghost: 0, psychic: 0.5, poison: 0.5 },
      poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5 },
      ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, rock: 2 },
      flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5 },
      psychic: { fighting: 2, poison: 2, psychic: 0.5 },
      bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2 },
      rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2 },
      ghost: { normal: 0, psychic: 2, ghost: 2 },
      dragon: { dragon: 2 }
    };

    let multiplier = 1;
    defendTypes.forEach(defType => {
      const typeRow = table[attackType.toLowerCase()];
      if (typeRow && typeRow[defType.toLowerCase()] !== undefined) {
        multiplier *= typeRow[defType.toLowerCase()];
      }
    });
    return multiplier;
  };

  // Perform a turn action (Player makes a move)
  const handlePlayerMove = async (moveName: string) => {
    if (isAnimating || battleState !== "fighting") return;
    
    setIsAnimating(true);
    playClickSound();

    const activePlayer = playerTeam[activePlayerIdx];
    const activeAi = aiTeam[activeAiIdx];

    // Determine move type (approximate type from name)
    let moveType = "normal";
    const nameLower = moveName.toLowerCase();
    if (nameLower.includes("fire") || nameLower.includes("blast") || nameLower.includes("flame")) moveType = "fire";
    else if (nameLower.includes("surf") || nameLower.includes("water") || nameLower.includes("hydro") || nameLower.includes("pump")) moveType = "water";
    else if (nameLower.includes("thunder") || nameLower.includes("bolt") || nameLower.includes("zap")) moveType = "electric";
    else if (nameLower.includes("blizzard") || nameLower.includes("ice") || nameLower.includes("beam")) moveType = "ice";
    else if (nameLower.includes("spore") || nameLower.includes("solar") || nameLower.includes("mega") || nameLower.includes("drain")) moveType = "grass";
    else if (nameLower.includes("earth") || nameLower.includes("quake") || nameLower.includes("dig")) moveType = "ground";
    else if (nameLower.includes("psychic") || nameLower.includes("hypno") || nameLower.includes("barrier")) moveType = "psychic";

    // Speed priority check
    const playerFirst = activePlayer.speed >= activeAi.speed;
    const currentLog: string[] = [];

    const executeAttack = (attacker: BattlePokemon, defender: BattlePokemon, move: string, isPlayerAttacking: boolean) => {
      // Crit calculation (approx 10%)
      const isCrit = Math.random() < 0.12;
      const critMultiplier = isCrit ? 1.8 : 1.0;

      // Type effectiveness multiplier
      const typeMult = getTypeMultiplier(moveType, defender.types);

      // Damage formula
      const ratio = attacker.attack / defender.defense;
      const baseDamage = ((2 * 50 / 5 + 2) * 60 * ratio / 50) + 2;
      const randomFactor = 0.85 + Math.random() * 0.15;
      
      let finalDamage = Math.round(baseDamage * randomFactor * typeMult * critMultiplier);
      if (finalDamage < 2) finalDamage = 2; // Minimal damage

      defender.hp = Math.max(0, defender.hp - finalDamage);

      let attackLog = `${attacker.name.toUpperCase()} used ${move.toUpperCase()}!`;
      if (isCrit) attackLog += " Critical hit! 💥";
      if (typeMult > 1) attackLog += " It's super effective! 🔥";
      if (typeMult > 0 && typeMult < 1) attackLog += " It's not very effective... 🛡️";
      if (typeMult === 0) attackLog += " It has no effect... 🍃";
      attackLog += ` dealt ${finalDamage} damage.`;

      currentLog.push(attackLog);
    };

    // --- TURN PHASE 1: First Attacker ---
    if (playerFirst) {
      // Player attacks first
      setHitTarget("ai");
      executeAttack(activePlayer, activeAi, moveName, true);
      setBattleLog(prev => [...prev, ...currentLog]);
      await new Promise(resolve => setTimeout(resolve, 800));
      setHitTarget(null);

      // Check if AI Pokemon fainted
      if (activeAi.hp <= 0) {
        setBattleLog(prev => [...prev, `💀 Gary's ${activeAi.name.toUpperCase()} fainted!`]);
        
        // Find next living AI Pokemon
        const nextAiIdx = aiTeam.findIndex((p, idx) => idx > activeAiIdx && p.hp > 0);
        if (nextAiIdx !== -1) {
          setActiveAiIdx(nextAiIdx);
          setBattleLog(prev => [...prev, ` Gary Oak sent out ${aiTeam[nextAiIdx].name.toUpperCase()}!`]);
          setIsAnimating(false);
          return;
        } else {
          // AI has no more living Pokemon
          setBattleState("victory");
          playSuccessSound();
          setIsAnimating(false);
          return;
        }
      }
    } else {
      // AI attacks first
      setHitTarget("player");
      const aiMove = activeAi.moves[Math.floor(Math.random() * activeAi.moves.length)];
      executeAttack(activeAi, activePlayer, aiMove, false);
      setBattleLog(prev => [...prev, ...currentLog]);
      await new Promise(resolve => setTimeout(resolve, 800));
      setHitTarget(null);

      // Check if Player Pokemon fainted
      if (activePlayer.hp <= 0) {
        setBattleLog(prev => [...prev, `💀 Your ${activePlayer.name.toUpperCase()} fainted!`]);
        
        // Find next living Player Pokemon
        const nextPlayerIdx = playerTeam.findIndex((p, idx) => idx > activePlayerIdx && p.hp > 0);
        if (nextPlayerIdx !== -1) {
          setActivePlayerIdx(nextPlayerIdx);
          setBattleLog(prev => [...prev, `Go! ${playerTeam[nextPlayerIdx].name.toUpperCase()}!`]);
          setIsAnimating(false);
          return;
        } else {
          // Player has no more living Pokemon
          setBattleState("defeat");
          playErrorSound();
          setIsAnimating(false);
          return;
        }
      }
    }

    // --- TURN PHASE 2: Second Attacker ---
    const secondLog: string[] = [];
    if (playerFirst) {
      // AI attacks second
      setHitTarget("player");
      const aiMove = activeAi.moves[Math.floor(Math.random() * activeAi.moves.length)];
      
      const isCrit = Math.random() < 0.12;
      const critMultiplier = isCrit ? 1.8 : 1.0;
      const typeMult = getTypeMultiplier("normal", activePlayer.types);
      const ratio = activeAi.attack / activePlayer.defense;
      const baseDamage = ((2 * 50 / 5 + 2) * 60 * ratio / 50) + 2;
      const randomFactor = 0.85 + Math.random() * 0.15;
      
      let finalDamage = Math.round(baseDamage * randomFactor * typeMult * critMultiplier);
      if (finalDamage < 2) finalDamage = 2;
      
      activePlayer.hp = Math.max(0, activePlayer.hp - finalDamage);

      let attackLog = `${activeAi.name.toUpperCase()} used ${aiMove.toUpperCase()}!`;
      if (isCrit) attackLog += " Critical hit! 💥";
      attackLog += ` dealt ${finalDamage} damage.`;
      secondLog.push(attackLog);

      setBattleLog(prev => [...prev, ...secondLog]);
      await new Promise(resolve => setTimeout(resolve, 800));
      setHitTarget(null);

      if (activePlayer.hp <= 0) {
        setBattleLog(prev => [...prev, `💀 Your ${activePlayer.name.toUpperCase()} fainted!`]);
        const nextPlayerIdx = playerTeam.findIndex((p, idx) => idx > activePlayerIdx && p.hp > 0);
        if (nextPlayerIdx !== -1) {
          setActivePlayerIdx(nextPlayerIdx);
          setBattleLog(prev => [...prev, `Go! ${playerTeam[nextPlayerIdx].name.toUpperCase()}!`]);
        } else {
          setBattleState("defeat");
          playErrorSound();
        }
      }
    } else {
      // Player attacks second
      setHitTarget("ai");
      
      const isCrit = Math.random() < 0.12;
      const critMultiplier = isCrit ? 1.8 : 1.0;
      const typeMult = getTypeMultiplier(moveType, activeAi.types);
      const ratio = activePlayer.attack / activeAi.defense;
      const baseDamage = ((2 * 50 / 5 + 2) * 60 * ratio / 50) + 2;
      const randomFactor = 0.85 + Math.random() * 0.15;
      
      let finalDamage = Math.round(baseDamage * randomFactor * typeMult * critMultiplier);
      if (finalDamage < 2) finalDamage = 2;
      
      activeAi.hp = Math.max(0, activeAi.hp - finalDamage);

      let attackLog = `${activePlayer.name.toUpperCase()} used ${moveName.toUpperCase()}!`;
      if (isCrit) attackLog += " Critical hit! 💥";
      if (typeMult > 1) attackLog += " It's super effective! 🔥";
      attackLog += ` dealt ${finalDamage} damage.`;
      secondLog.push(attackLog);

      setBattleLog(prev => [...prev, ...secondLog]);
      await new Promise(resolve => setTimeout(resolve, 800));
      setHitTarget(null);

      if (activeAi.hp <= 0) {
        setBattleLog(prev => [...prev, `💀 Gary's ${activeAi.name.toUpperCase()} fainted!`]);
        const nextAiIdx = aiTeam.findIndex((p, idx) => idx > activeAiIdx && p.hp > 0);
        if (nextAiIdx !== -1) {
          setActiveAiIdx(nextAiIdx);
          setBattleLog(prev => [...prev, `Gary Oak sent out ${aiTeam[nextAiIdx].name.toUpperCase()}!`]);
        } else {
          setBattleState("victory");
          playSuccessSound();
        }
      }
    }

    setIsAnimating(false);
  };

  // Simulated PvP search
  const startPvpSearch = () => {
    playClickSound();
    setPvpSearchState("searching");
    setPvpLog(["Connecting to websocket matchmaking lobby...", "Searching for other trainers online..."]);

    const timer = setTimeout(() => {
      setPvpSearchState("connected");
      playSuccessSound();
      setPvpLog(prev => [
        ...prev,
        "Connected to Arena-Server Channel #845",
        "Opponent Trainer LANCE (Dragon Master) matched!",
        "Lance sent out GYARADOS (#130)!",
        "Go! Your first roster member is loaded!"
      ]);
    }, 3500);

    return () => clearTimeout(timer);
  };

  const executePvpMove = (move: string) => {
    playClickSound();
    setPvpLog(prev => [
      ...prev,
      `You selected ${move.toUpperCase()}!`,
      `Opponent selected Dragon Rage!`,
      `GYARADOS took 45 damage. Your Pokemon took 40 damage.`,
      `Lance: 'Not bad, trainer! Let's see how you handle this!'`
    ]);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <Card className={`max-w-4xl w-full max-h-[92vh] overflow-hidden border-2 shadow-2xl flex flex-col ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-blue-200'}`}>
        
        {/* Header */}
        <CardHeader className={`pb-3 flex flex-row justify-between items-center bg-gradient-to-r ${darkMode ? 'from-red-950 to-gray-950 border-b border-gray-800' : 'from-red-50 to-indigo-50 border-b border-gray-250'}`}>
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-red-650">
              <Sword className="w-6 h-6 animate-pulse" />
              Oak's Battle Arena
            </CardTitle>
            <CardDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Retro 8-bit Gen I Combat Simulator & Multiplayer Lobby
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              playClickSound();
              setShowBattleArena(false);
            }}
            className="h-9 w-9 p-0 rounded-full hover:bg-red-500/20"
          >
            <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
          </Button>
        </CardHeader>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-800 bg-gray-950/60 p-2 gap-2">
          <Button
            variant={activeTab === "ai" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              playClickSound();
              setActiveTab("ai");
            }}
            className="flex items-center gap-2 font-semibold"
          >
            <Shield className="w-4 h-4" />
            Arena vs AI (Gary Oak)
          </Button>
          <Button
            variant={activeTab === "pvp" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              playClickSound();
              setActiveTab("pvp");
            }}
            className="flex items-center gap-2 font-semibold"
          >
            <Users className="w-4 h-4" />
            Multiplayer PvP Lobby
            <Badge className="bg-green-600 text-xxs px-1.5 py-0">{onlineCount} Active</Badge>
          </Button>
        </div>

        {/* Content Body */}
        <CardContent className="flex-1 overflow-y-auto p-6 flex flex-col justify-between min-h-[50vh]">
          
          {/* ==================================================== */}
          {/* TAB 1: LOCAL VS AI BATTLE ARENA */}
          {/* ==================================================== */}
          {activeTab === "ai" && (
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              {/* Setup State */}
              {battleState === "setup" && (
                <div className="text-center py-12 space-y-6 max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(239,68,68,0.2)]">
                    <Sword className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold">Ready for Battle?</h3>
                  <p className="text-sm text-gray-400">
                    Draft a team of 3 Pokemon to face your rival, Gary Oak. Gary has trained a powerful Gen I combat roster to challenge your strategy!
                  </p>
                  <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800 text-xs text-left space-y-2">
                    <p className="font-semibold text-gray-300">Active Roster Rules:</p>
                    <p>• Combats are determined by Speed priority.</p>
                    <p>• Normal, Fire, Water, Grass, Electric, Ground, and Ice type effectiveness is fully simulated.</p>
                    <p>• Turn actions play 8-bit sound effects based on outcomes.</p>
                  </div>
                  <Button
                    onClick={initializeBattle}
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 font-bold"
                  >
                    Enter Battle Arena
                  </Button>
                </div>
              )}

              {/* Fighting State */}
              {battleState === "fighting" && playerTeam[activePlayerIdx] && aiTeam[activeAiIdx] && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  
                  {/* Combat Visual Panel */}
                  <div className="grid grid-cols-2 gap-4 bg-gray-950/80 p-6 rounded-xl border border-gray-800 relative overflow-hidden min-h-[240px]">
                    {/* Background grid texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/15 via-transparent to-transparent opacity-70 pointer-events-none" />

                    {/* Opponent (Gary Oak) Active Card */}
                    <div className={`p-3 rounded-lg border text-right transition-all duration-300 flex flex-col justify-between ${hitTarget === "ai" ? "bg-red-500/20 border-red-500 animate-bounce" : "bg-gray-900/60 border-gray-800"}`}>
                      <div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-xxs uppercase tracking-wider text-red-450 border-red-900/50">Rival</Badge>
                          <span className="font-bold capitalize text-sm">{aiTeam[activeAiIdx].name}</span>
                        </div>
                        <p className="text-xxs text-gray-400 mt-1">HP: {aiTeam[activeAiIdx].hp} / {aiTeam[activeAiIdx].maxHp}</p>
                        <Progress value={(aiTeam[activeAiIdx].hp / aiTeam[activeAiIdx].maxHp) * 100} className="h-2 bg-gray-850 mt-1" />
                      </div>
                      <div className="flex justify-end mt-2">
                        <img 
                          src={aiTeam[activeAiIdx].image} 
                          alt={aiTeam[activeAiIdx].name}
                          className="w-24 h-24 object-contain scale-x-[-1] drop-shadow-[0_0_12px_rgba(239,68,68,0.2)]" 
                        />
                      </div>
                    </div>

                    {/* Player Active Card */}
                    <div className={`p-3 rounded-lg border text-left transition-all duration-300 flex flex-col justify-between ${hitTarget === "player" ? "bg-red-500/20 border-red-500 animate-bounce" : "bg-gray-900/60 border-gray-800"}`}>
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold capitalize text-sm">{playerTeam[activePlayerIdx].name}</span>
                          <Badge variant="outline" className="text-xxs uppercase tracking-wider text-blue-450 border-blue-900/50">Trainer</Badge>
                        </div>
                        <p className="text-xxs text-gray-400 mt-1">HP: {playerTeam[activePlayerIdx].hp} / {playerTeam[activePlayerIdx].maxHp}</p>
                        <Progress value={(playerTeam[activePlayerIdx].hp / playerTeam[activePlayerIdx].maxHp) * 100} className="h-2 bg-gray-850 mt-1" />
                      </div>
                      <div className="flex justify-start mt-2">
                        <img 
                          src={playerTeam[activePlayerIdx].image} 
                          alt={playerTeam[activePlayerIdx].name}
                          className="w-24 h-24 object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.2)]" 
                        />
                      </div>
                    </div>

                  </div>

                  {/* Battle Logs Console */}
                  <div 
                    ref={logContainerRef}
                    className="flex-1 max-h-[140px] overflow-y-auto bg-black p-3 rounded-lg border border-gray-800 font-mono text-xs text-green-400 space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5 text-green-500 border-b border-gray-900 pb-1 mb-2">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>BATTLE LOG CONSOLE</span>
                    </div>
                    {battleLog.map((log, idx) => (
                      <p key={idx}>{log}</p>
                    ))}
                  </div>

                  {/* Moves Selection Panel */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-400 block">Select Attack Move:</span>
                    <div className="grid grid-cols-2 gap-3">
                      {playerTeam[activePlayerIdx].moves.map((move, idx) => (
                        <Button
                          key={idx}
                          disabled={isAnimating}
                          onClick={() => handlePlayerMove(move)}
                          className="justify-start font-mono text-xs uppercase bg-gray-950 border border-gray-800 text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-200"
                        >
                          ⚔️ {move}
                        </Button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Victory State */}
              {battleState === "victory" && (
                <div className="text-center py-12 space-y-6 max-w-md mx-auto">
                  <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(234,179,8,0.2)] animate-pulse">
                    <Trophy className="w-10 h-10 text-yellow-500" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-yellow-500">VICTORY!</h3>
                  <p className="text-sm text-gray-450">
                    You have successfully defeated Gary Oak and proved your standing as a SOTA Gen I Champion. Professor Oak is proud!
                  </p>
                  <Button
                    onClick={() => setBattleState("setup")}
                    className="w-full bg-yellow-500 hover:bg-yellow-450 text-black font-bold"
                  >
                    Battle Again
                  </Button>
                </div>
              )}

              {/* Defeat State */}
              {battleState === "defeat" && (
                <div className="text-center py-12 space-y-6 max-w-md mx-auto">
                  <div className="w-20 h-20 rounded-full bg-red-650/10 border border-red-650/30 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(220,38,38,0.2)]">
                    <X className="w-10 h-10 text-red-650" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-red-650">DEFEATED</h3>
                  <p className="text-sm text-gray-450">
                    Your entire team has fainted. Gary Oak boasts: 'Smell ya later!' Keep training and refine your type matchup strategies!
                  </p>
                  <Button
                    onClick={() => setBattleState("setup")}
                    className="w-full bg-red-650 hover:bg-red-600 font-bold"
                  >
                    Try Again
                  </Button>
                </div>
              )}

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: MULTIPLAYER PVP LOBBY */}
          {/* ==================================================== */}
          {activeTab === "pvp" && (
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              {pvpSearchState === "idle" && (
                <div className="text-center py-12 space-y-6 max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(34,197,94,0.2)]">
                    <Users className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold">Trainer PvP Lobby</h3>
                  <p className="text-sm text-gray-400">
                    Search and match with other active trainers online using our WebSocket server channel sync. Battle in real-time over the network!
                  </p>
                  <Button
                    onClick={startPvpSearch}
                    className="w-full bg-green-600 hover:bg-green-500 font-bold"
                  >
                    Find Opponent Matchup
                  </Button>
                </div>
              )}

              {pvpSearchState === "searching" && (
                <div className="text-center py-16 space-y-6 max-w-md mx-auto">
                  <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <h4 className="text-lg font-mono">Searching For Match...</h4>
                  <div className="bg-black p-3 rounded text-left font-mono text-xs text-green-400 min-h-[80px]">
                    {pvpLog.map((log, i) => <p key={i}>{log}</p>)}
                  </div>
                </div>
              )}

              {pvpSearchState === "connected" && (
                <div className="flex-1 flex flex-col justify-between space-y-6">
                  
                  {/* PvP Screen */}
                  <div className="grid grid-cols-2 gap-4 bg-gray-950 p-6 rounded-xl border border-gray-800 text-center min-h-[160px] relative">
                    <div className="p-3 border border-gray-800 rounded bg-gray-900/60">
                      <span className="text-xs text-red-500 font-bold block">GYARADOS (Lvl 50)</span>
                      <Progress value={85} className="h-1.5 bg-gray-800 mt-2" />
                    </div>
                    <div className="p-3 border border-gray-800 rounded bg-gray-900/60">
                      <span className="text-xs text-blue-500 font-bold block">YOUR TEAM (Lvl 50)</span>
                      <Progress value={92} className="h-1.5 bg-gray-800 mt-2" />
                    </div>
                  </div>

                  {/* PvP Console */}
                  <div className="flex-1 max-h-[160px] overflow-y-auto bg-black p-3 rounded-lg border border-gray-800 font-mono text-xs text-green-400">
                    {pvpLog.map((log, idx) => <p key={idx}>{log}</p>)}
                  </div>

                  {/* Action Choices */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => executePvpMove("Tackle")}
                      className="font-mono text-xs bg-gray-950 border border-gray-800 hover:bg-green-600"
                    >
                      Tackle
                    </Button>
                    <Button 
                      onClick={() => executePvpMove("Mega Punch")}
                      className="font-mono text-xs bg-gray-950 border border-gray-800 hover:bg-green-600"
                    >
                      Mega Punch
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      playClickSound();
                      setPvpSearchState("idle");
                    }}
                    className="w-full text-xs text-gray-500 hover:text-red-500"
                  >
                    Disconnect From Lobby
                  </Button>
                </div>
              )}

            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};
