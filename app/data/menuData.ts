// The Modern Table - Curated Menu (36 Premium Dishes)
// All images are high-quality, royalty-free food images

export interface MenuItem {
  name: string;
  img: string;
  desc: string;
  price: string;
  category: string;
}

export interface MenuData {
  appetizers: MenuItem[];
  seafood: MenuItem[];
  meats: MenuItem[];
  pasta: MenuItem[];
  desserts: MenuItem[];
  beverages: MenuItem[];
}

export const menu: MenuData = {
  appetizers: [
    { name: "Beef Carpaccio", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80", desc: "Thinly sliced raw beef with arugula, parmesan, and truffle oil. Finished with aged balsamic and crispy capers.", price: "$38", category: "Appetizer" },
    { name: "Oysters Rockefeller", img: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=1200&q=80", desc: "Fresh oysters baked with herbs, breadcrumbs, and garlic butter. A timeless French-inspired classic.", price: "$42", category: "Appetizer" },
    { name: "Foie Gras", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80", desc: "Pan-seared foie gras with fig compote and toasted brioche. Rich, buttery, and utterly indulgent.", price: "$65", category: "Appetizer" },
    { name: "Tuna Tartare", img: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1200&q=80", desc: "Fresh yellowfin tuna with avocado, sesame, and ponzu sauce. Delicate and beautifully presented.", price: "$44", category: "Appetizer" },
    { name: "Bruschetta Trio", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80", desc: "Three varieties on grilled sourdough: tomato-basil, mushroom truffle, and ricotta fig. Perfectly toasted and flavorful.", price: "$28", category: "Appetizer" },
    { name: "Burrata", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80", desc: "Creamy burrata cheese with grilled peaches and prosciutto. Finished with balsamic reduction.", price: "$34", category: "Appetizer" }
  ],
  
  seafood: [
    { name: "Lobster Risotto", img: "https://images.pexels.com/photos/8477553/pexels-photo-8477553.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Creamy saffron risotto with Maine lobster and microgreens. Rich, decadent, and perfectly balanced.", price: "$59", category: "Seafood" },
    { name: "Pan-Seared Scallops", img: "https://images.pexels.com/photos/7474641/pexels-photo-7474641.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Fresh sea scallops with cauliflower puree and crispy pancetta. Seared to golden perfection.", price: "$52", category: "Seafood" },
    { name: "Sushi Platter", img: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Premium selection of nigiri and sashimi with wasabi and pickled ginger. Chef's daily selection of the finest fish.", price: "$68", category: "Seafood" },
    { name: "Grilled Salmon", img: "https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Atlantic salmon with lemon butter, asparagus, and herb oil. Sustainably sourced and perfectly cooked.", price: "$48", category: "Seafood" },
    { name: "Seafood Paella", img: "https://images.pexels.com/photos/8477556/pexels-photo-8477556.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Traditional Spanish rice with mussels, shrimp, squid, and saffron. Cooked in a traditional paella pan.", price: "$58", category: "Seafood" },
    { name: "Chilean Sea Bass", img: "https://images.pexels.com/photos/5638529/pexels-photo-5638529.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Miso-glazed sea bass with bok choy and ginger sauce. Buttery, flaky, and melt-in-your-mouth tender.", price: "$64", category: "Seafood" }
  ],
  
  meats: [
    { name: "Wagyu Beef Steak", img: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Prime cut wagyu with truffle butter and seasonal vegetables. Marbled to perfection with unmatched tenderness.", price: "$89", category: "Premium Meat" },
    { name: "Filet Mignon", img: "https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Tender beef tenderloin with red wine reduction and roasted garlic. The most tender cut, cooked to your preference.", price: "$82", category: "Premium Meat" },
    { name: "Lamb Rack", img: "https://images.pexels.com/photos/5638534/pexels-photo-5638534.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Herb-crusted lamb rack with rosemary jus and root vegetables. Frenched and perfectly roasted.", price: "$72", category: "Premium Meat" },
    { name: "Duck Confit", img: "https://images.pexels.com/photos/6107668/pexels-photo-6107668.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Slow-cooked duck leg with orange glaze and seasonal vegetables. Crispy skin with tender, falling-off-the-bone meat.", price: "$56", category: "Poultry" },
    { name: "Beef Wellington", img: "https://images.pexels.com/photos/8753557/pexels-photo-8753557.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Beef tenderloin wrapped in puff pastry with mushroom duxelles. Classic British dish prepared to perfection.", price: "$90", category: "Premium Meat" },
    { name: "Ribeye Steak", img: "https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Prime ribeye with compound butter, mashed potatoes, and broccolini. Rich marbling for maximum flavor.", price: "$78", category: "Premium Meat" }
  ],
  
  pasta: [
    { name: "Truffle Pasta", img: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Handmade pasta with black truffle and parmesan cream sauce. Earthy, luxurious, and utterly decadent.", price: "$45", category: "Pasta" },
    { name: "Carbonara", img: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Traditional Roman pasta with guanciale, egg, and pecorino romano. Creamy, rich, and authentically Italian.", price: "$38", category: "Pasta" },
    { name: "Seafood Linguine", img: "https://images.pexels.com/photos/5419336/pexels-photo-5419336.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Fresh linguine with prawns, mussels, and cherry tomatoes in white wine. Light, fresh, and full of ocean flavor.", price: "$52", category: "Pasta" },
    { name: "Lasagna Bolognese", img: "https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Classic lasagna with slow-cooked meat ragu and bechamel sauce. Layered perfection baked until golden.", price: "$42", category: "Pasta" },
    { name: "Lobster Linguine", img: "https://images.pexels.com/photos/8601236/pexels-photo-8601236.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Fresh linguine with lobster in tomato cream sauce. Luxurious seafood pasta with rich sauce.", price: "$58", category: "Pasta" },
    { name: "Cacio e Pepe", img: "https://images.pexels.com/photos/5639516/pexels-photo-5639516.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Roman pasta with pecorino cheese and black pepper. Simple ingredients, extraordinary flavor.", price: "$34", category: "Pasta" }
  ],
  
  desserts: [
    { name: "Chocolate Lava Cake", img: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Decadent dark chocolate cake with molten center and vanilla ice cream. Warm, gooey, and utterly indulgent.", price: "$18", category: "Dessert" },
    { name: "Crème Brûlée", img: "https://images.pexels.com/photos/12737654/pexels-photo-12737654.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Classic French custard with caramelized sugar crust and fresh berries. Creamy custard meets crispy caramel.", price: "$16", category: "Dessert" },
    { name: "Tiramisu", img: "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Italian coffee-flavored dessert with mascarpone and cocoa. Layered perfection from Veneto.", price: "$15", category: "Dessert" },
    { name: "Panna Cotta", img: "https://images.pexels.com/photos/7474640/pexels-photo-7474640.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Silky Italian custard with berry compote and mint. Light, creamy, and elegantly simple.", price: "$14", category: "Dessert" },
    { name: "Fruit Tart", img: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Buttery tart shell with vanilla custard and seasonal fresh fruits. Colorful and refreshing.", price: "$17", category: "Dessert" },
    { name: "Cheesecake", img: "https://images.pexels.com/photos/3776942/pexels-photo-3776942.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "New York-style cheesecake with graham cracker crust and berry sauce. Rich, dense, and creamy.", price: "$16", category: "Dessert" }
  ],
  
  beverages: [
    { name: "Tropical Sunrise Mocktail", img: "https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Orange juice, pineapple, and grenadine with fresh fruit garnish. Vibrant, fruity, and Instagram-worthy.", price: "$10", category: "Beverage" },
    { name: "Cold Brew Coffee", img: "https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Smooth cold brew steeped for 24 hours, served over ice. Bold, smooth, and perfectly caffeinated.", price: "$7", category: "Beverage" },
    { name: "Iced Cappuccino", img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Espresso with cold frothed milk and ice. Smooth, creamy, and beautifully layered.", price: "$9", category: "Beverage" },
    { name: "Matcha Latte", img: "https://images.pexels.com/photos/4226893/pexels-photo-4226893.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Premium Japanese matcha whisked with steamed milk. Earthy, smooth, and antioxidant-rich.", price: "$10", category: "Beverage" },
    { name: "Espresso", img: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Double shot of premium Italian espresso. Bold, intense, and perfectly extracted.", price: "$6", category: "Beverage" },
    { name: "Virgin Mojito", img: "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80", desc: "Lime, mint, and soda water with a touch of sugar. Classic mocktail that's bright and refreshing.", price: "$9", category: "Beverage" }
  ]
};

// Helper functions
export const getCategories = () => Object.keys(menu) as Array<keyof MenuData>;
export const getDishesByCategory = (category: keyof MenuData) => menu[category];
export const getAllDishes = () => Object.values(menu).flat();
