const assignment = require('./questions.js');

let questionsPython =[ 
    {
        subject:"python",
        question:{
            id:1,
            problemStatement:`Write a python program that prompts the user to input a Celsius temperature 
            and outputs the equivalent temperature in Fahrenheit. The formula to convert 
            the temperature is: F = 9/5 C + 32 where F is the Fahrenheit temperature and C 
            is the Celsius temperature.`,
        }
    },
    {
        subject:"python",
        question:{
            id:2,
            problemStatement:`Write a python program that accepts seconds from keyboard as integer. Your 
            program should convert seconds in hours, minutes and seconds. Your output 
            should like this:
             Enter seconds: 13400
             Hours: 3
             Minutes: 43
             Seconds: 20`,
        }
    },

];
assignment.insertMany(questionsPython);




