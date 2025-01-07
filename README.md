# kalorien_ai

Are you also annoyed by having to laboriously calculate the calorie value of a snack or meal? This is a script for Google Sheets that calculates a suitable kcal number for the description of a dish or meal. It implements a new function CALORIES() that takes a written description of a meal as input and returns the estimated kcal value by asking OpenAI's ChatGPT for it. Since ChatGPT accepts multilingual input, this script does too.

```=CALORIES("One Croissant and a Café au lait.")``` returns ```310```

ChatGPT may return varying values for the same prompt. However, it still seems to be a good estimation of what the reality might be.

## How To Use

1. Open Apps Script
 
![Open Apps Script](screenshot1.png)

2. Insert code and your OpenAI API key

![Insert code and your OpenAI API key](screenshot2.png)

3. Use the new CALORIES function!

![Use the new CALORIES function!](screenshot3.png)

