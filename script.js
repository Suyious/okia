const display = document.querySelector(".screen>.display_text>h1");
const keypad = document.querySelector(".keypad");
const InputBar = document.querySelector("#input");
const InputButtons = document.querySelectorAll(".InputButton");
const BackButton = document.querySelector(".BackButton");

const keymap = {      //key mapping for the keypad
  0: " ",
  1: ".,?!",
  2: "abc",
  3: "def",
  4: "ghi",
  5: "jkl",
  6: "mno",
  7: "pqrs",
  8: "tuv",
  9: "wxyz",
};

let waiter,         //for the setTimeout during repeated letter
displayText = "";   //string for input

const keymapResolver = (strinput, pressCount) => {  //function returns character corresponding
  let value = keymap[strinput];                     //pressing a key a certain times
  if (value) {
    if (pressCount <= value.length) {
      return value[pressCount - 1];
    } else {
      return value[pressCount % value.length];
    }
  } else return strinput;
};


const keypadResolver = (str) => {                   //function returns string for a certain 
  let result = "",                                  //numeric input
    temp = "\0",    //pressed number on keypad
    pressCount = 0, //times pressed
    charCount = 0;  //number of characters in total
  for (let i = 0; i < str.length; i++) {
    if (str[i] != temp) {
      temp = str[i];
      pressCount = 1;
      result += keymapResolver(temp, pressCount);
      charCount++;
    } else if (str[i] == temp) {
      pressCount++;
      result[charCount - 1] = keymapResolver(temp, pressCount);
      result =
        result.substring(0, charCount - 1) +
        keymapResolver(temp, pressCount) +
        result.substring(charCount + 1);
    }
  }
  return result;
};

const DeleteCharFromEnd = () => {   //function deletes one character from the end of input
  if(InputBar.value==""){
    displayText = displayText.substring(0,displayText.length-1);
    display.textContent = displayText;
  } else {
    InputBar.value = "";
    display.textContent= displayText+keypadResolver(InputBar.value);
  }
}

//ideas for implementing edit
//variables cursorPosition and textToRightOfCursor

InputBar.addEventListener("input", (e) => {
  clearTimeout(waiter);
  display.textContent= displayText+keypadResolver(e.target.value);
  if(e.target.value[0]!=e.target.value[e.target.value.length-1]){
    displayText+=keypadResolver(e.target.value.substring(0,e.target.value.length-1));
    display.textContent =displayText;
    InputBar.value=e.target.value[e.target.value.length-1];
    display.textContent= displayText+keypadResolver(e.target.value);
  }
  waiter = setTimeout(()=>{
    displayText+=keypadResolver(e.target.value);
    InputBar.value = "";
    display.textContent =displayText;
  },2000)
});

InputBar.addEventListener("keydown",(e)=>{
  if(e.key=="Backspace"){
    DeleteCharFromEnd();
  }
})

BackButton.onclick = () => {
  DeleteCharFromEnd();
}

InputButtons.forEach(inputButton=>{
  inputButton.onclick = () => {
    InputBar.value+=inputButton.querySelector("h1").textContent;
    InputBar.dispatchEvent(new Event('input',{bubbles: true}))
  }
})



