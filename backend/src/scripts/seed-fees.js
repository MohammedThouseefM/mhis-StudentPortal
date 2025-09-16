const mongoose = require('mongoose');
const Student = require('../models/student.model');
const Fee = require('../models/fee.model');
const config = require('../config/config');

// Connect to MongoDB
mongoose.connect(config.DB.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB for seeding fees');
  
  try {
    // Get all students
    const students = await Student.find();
    
    if (students.length === 0) {
      console.log('No students found. Please add students first.');
      process.exit(1);
    }
    
    console.log(`Found ${students.length} students. Creating fee records...`);
    
    // Delete existing fees
    await Fee.deleteMany({});
    
    // Create fee records for each student
    const feePromises = students.map(async (student) => {
      // Calculate fee based on year (which is now a string like "1st Year")
      let totalFee = 50000; // Default fee
      
      // Extract the year number from the string format
      if (student.year && typeof student.year === 'string') {
        const yearMatch = student.year.match(/^(\d+)/);
        if (yearMatch) {
          const yearNum = parseInt(yearMatch[1], 10);
          // Adjust fee based on year number
          totalFee = 40000 + (yearNum * 5000); // Example: 1st year = 45000, 2nd year = 50000, etc.
        }
      } else if (student.year && typeof student.year === 'number') {
        // If year is already a number, use it directly
        totalFee = 40000 + (student.year * 5000);
      }
      
      const statuses = ['Paid', 'Pending', 'Overdue'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      let paid = 0;
      let balance = totalFee;
      
      if (randomStatus === 'Paid') {
        paid = totalFee;
        balance = 0;
      } else if (randomStatus === 'Pending') {
        paid = Math.floor(Math.random() * totalFee);
        balance = totalFee - paid;
      }
      
      const fee = new Fee({
        student: student._id,
        semester: 'Spring',
        academicYear: '2023-2024',
        totalFee,
        paid,
        balance,
        status: randomStatus,
        dueDate: new Date('2023-12-31'),
        lastPaymentDate: paid > 0 ? new Date() : null
      });
      
      return fee.save();
    });
    
    await Promise.all(feePromises);
    
    console.log('Fee records created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding fees:', error);
    process.exit(1);
  }
});