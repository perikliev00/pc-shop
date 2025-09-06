const mongoose = require('mongoose');
const Home = require('../models/Home');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = 'mongodb://localhost:27017/pc-shop';

// Section data with images
const sectionData = {
  'description-title': 'PC Components - Build Your Dream Rig',
  'description': 'Discover premium PC components for ultimate performance. From powerful processors to lightning-fast storage, we have everything you need to build your dream gaming rig.',
  'products': [
    {
      'product-title': 'CPUs & Processors',
      'product-description': 'High-performance processors from Intel and AMD. Choose from dual-core to 64-core processors for gaming, content creation, and professional workloads.',
      'image': '/images/section-cpu.svg'
    },
    {
      'product-title': 'Memory (RAM)',
      'product-description': 'Fast DDR4 and DDR5 memory modules. From 8GB to 128GB configurations with speeds up to 7200MHz for maximum performance.',
      'image': '/images/section-ram.svg'
    },
    {
      'product-title': 'Graphics Cards',
      'product-description': 'NVIDIA RTX and AMD Radeon graphics cards. Experience ray tracing, DLSS, and ultra-high frame rates for immersive gaming.',
      'image': '/images/section-graphics.svg'
    },
    {
      'product-title': 'Storage Solutions',
      'product-description': 'NVMe SSDs, SATA SSDs, and HDDs. Lightning-fast storage with capacities from 250GB to 8TB for all your data needs.',
      'image': '/images/section-storage.svg'
    },
    {
      'product-title': 'Cooling Systems',
      'product-description': 'Air coolers and liquid cooling solutions. Keep your components running cool and quiet with premium cooling technology.',
      'image': '/images/section-cooling.svg'
    },
    {
      'product-title': 'Power Supplies',
      'product-description': 'Modular and non-modular PSUs from 450W to 1600W. 80+ certified power supplies for reliable and efficient operation.',
      'image': '/images/section-power.svg'
    },
    {
      'product-title': 'PC Cases',
      'product-description': 'Stylish and functional PC cases. From compact ITX builds to full-tower cases with excellent airflow and cable management.',
      'image': '/images/section-case.svg'
    },
    {
      'product-title': 'Other Components',
      'product-description': 'Motherboards, optical drives, fans, and accessories. Complete your build with quality components and peripherals.',
      'image': '/images/section-other.svg'
    }
  ]
};

async function populateSections() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Home.deleteMany({});
    console.log('Cleared existing data');

    // Insert new section data
    const result = await Home.create(sectionData);
    console.log('Sections populated successfully:', result);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error populating sections:', error);
    process.exit(1);
  }
}

// Run the script
populateSections();
