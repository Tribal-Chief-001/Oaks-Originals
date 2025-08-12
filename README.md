# 🎮 Oak's Originals

Professor Oak's personal collection of the original 151 Pokémon from the Kanto region, presented in a modern, responsive digital format. A tribute to where it all began! 🌟

![Oak's Originals Screenshot](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png)

## ✨ Features

- **Complete Kanto Pokédex**: All 151 original Pokémon with detailed information
- **Advanced Search & Filter**: Search by name, ID, or filter by Pokémon type
- **Smart Sorting**: Sort by ID, name, height, or weight in ascending/descending order
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Details**: Click any Pokémon to see detailed stats, abilities, and characteristics
- **Real-time API Integration**: Fetches live data from the PokéAPI
- **Beautiful UI**: Built with shadcn/ui components and Tailwind CSS
- **Loading States**: Smooth loading animations and skeleton screens
- **Type-based Color Coding**: Each Pokémon type has its own distinctive color scheme

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/oaks-originals.git
   cd oaks-originals
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **API**: PokéAPI integration
- **State Management**: React hooks
- **Build Tool**: Next.js built-in bundler

## 📱 Usage

### Searching Pokémon
- Use the search bar to find Pokémon by name or ID number
- Results update in real-time as you type

### Filtering by Type
- Click on type buttons to filter Pokémon by their primary/secondary types
- Select "All Types" to remove the filter

### Sorting
- Use the dropdown to sort by ID, name, height, or weight
- Toggle between ascending and descending order with the sort button

### Viewing Details
- Click on any Pokémon card to view detailed information
- See stats, abilities, physical characteristics, and more
- Close the modal by clicking the X button or outside the modal

## 🎨 Design Features

- **Responsive Grid Layout**: Adapts from 1 column on mobile to 5 columns on large screens
- **Hover Effects**: Cards lift and show borders on hover for better interactivity
- **Type Color Coding**: Each Pokémon type has consistent, accessible colors
- **Loading Skeletons**: Smooth loading experience while data is being fetched
- **Modal Details**: Beautiful modal with gradient backgrounds and organized information
- **Stat Visualization**: Visual progress bars for base stats with gradient fills

## 📊 API Integration

This project uses the [PokéAPI](https://pokeapi.co/) to fetch real-time Pokémon data:

- **List Endpoint**: `/api/pokemon` - Fetches the first 151 Pokémon
- **Detail Endpoint**: `/api/pokemon/[id]` - Fetches detailed information for a specific Pokémon
- **Fallback Data**: Includes mock data for offline/demo purposes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Professor Oak** - The original Pokémon Professor who started it all!
- **PokéAPI** for providing the amazing Pokémon data API
- **The Pokémon Company** for creating the wonderful world of Pokémon
- **Next.js** team for the excellent framework
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework

## 🎯 Future Enhancements

- [ ] Add more regions (Johto, Hoenn, etc.)
- [ ] Implement favorites/bookmarking system
- [ ] Add evolution chains display
- [ ] Include move sets and battle stats
- [ ] Add dark mode support
- [ ] Implement PWA features
- [ ] Add sound effects and animations
- [ ] Include comparison tool between Pokémon

---

**Built with ❤️ using Next.js and the power of TypeScript**

*"See? This is the Pokédex I was telling you about!"* - Professor Oak