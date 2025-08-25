import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Leaf, Wheat, Heart, Utensils, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { menuApiService, MenuItemDTO } from '../../services/menuApi';

export const MenuPage: React.FC = () => {
  const { addToCart, cart } = useApp();
  const [menuItems, setMenuItems] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      let data;
      try {
        data = await menuApiService.getAvailableMenuItems();
      } catch (err) {
        console.log('Available menu items endpoint failed, trying getAllMenuItems...');
        data = await menuApiService.getAllMenuItems();
      }
      
      console.log('Menu items loaded from backend:', data);
      console.log('Sample menu item:', data[0]);
      setMenuItems(data);
      setError(null);
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error loading menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItemDTO) => {
    const cartItem = {
      id: item.id?.toString() || '',
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image || 'https://via.placeholder.com/400x300?text=No+Image',
      category: item.category,
      dietary: item.dietary || [],
      available: item.available,
      ingredients: item.ingredients || [],
      quantity: 1
    };
    
    console.log('Adding to cart:', cartItem);
    addToCart(cartItem);
    
    setRecentlyAdded(item.name);
    setTimeout(() => setRecentlyAdded(null), 2000);
  };

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];
  const dietaryOptions = ['all', ...Array.from(new Set(menuItems.flatMap(item => item.dietary || [])))];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDietary = selectedDietary === 'all' || (item.dietary && item.dietary.includes(selectedDietary));
    
    return matchesSearch && matchesCategory && matchesDietary && item.available;
  });

  const getDietaryIcon = (dietary: string) => {
    switch (dietary.toLowerCase()) {
      case 'vegetarian':
        return <Leaf className="h-4 w-4 text-green-600" />;
      case 'vegan':
        return <Heart className="h-4 w-4 text-green-700" />;
      case 'gluten-free':
        return <Wheat className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-12 mb-8 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200)'
            }}
          ></div>
          <div className="relative text-center">
            <Utensils className="h-12 w-12 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Our Sustainable Menu</h1>
            <p className="text-green-100 text-lg">Fresh, locally sourced ingredients crafted into delicious, eco-friendly dishes</p>
            {cart.length > 0 && (
              <div className="mt-4 inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white text-sm">
                  {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-green-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                value={selectedDietary}
                onChange={(e) => setSelectedDietary(e.target.value)}
                className="border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              >
                {dietaryOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Dietary' : option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {recentlyAdded && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {recentlyAdded} added to cart!
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100 hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img
                  src={item.image && item.image.startsWith('http') ? item.image : 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-1">
                  {item.dietary && item.dietary.map(dietary => (
                    <div key={dietary} className="bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-sm">
                      {getDietaryIcon(dietary)}
                    </div>
                  ))}
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    ${item.price}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-lg font-bold text-green-600">${item.price}</span>
                </div>

                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Ingredients:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.slice(0, 3).map((ingredient, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {ingredient}
                        </span>
                      ))}
                      {item.ingredients.length > 3 && (
                        <span className="text-xs text-gray-500">+{item.ingredients.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No menu items found</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};