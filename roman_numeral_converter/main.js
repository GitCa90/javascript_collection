let input = document.getElementById("userinput");
let errorMessage = document.getElementById("error");
let answer = document.getElementById("answer");

answer.innerText = "...";

let ones = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
let tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
let hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
let thousands = ["", "M", "MM", "MMM"];

const isNumber = () => {
  const value = parseInt(input.value, 10);
  if (!input.value) {
    answer.innerText = "...";
    errorMessage.classList.remove("visible");
  } else if (value < 1 || value > 3999 || isNaN(value)) {
    answer.innerText = "...";
    errorMessage.classList.add("visible");
  } else {
    errorMessage.classList.remove("visible");
    converter();
  }
};

const converter = () => {
  const value = parseInt(input.value, 10);
  const str = value.toString().padStart(4, "0");

  answer.innerText =
    thousands[parseInt(str[0])] +
    hundreds[parseInt(str[1])] +
    tens[parseInt(str[2])] +
    ones[parseInt(str[3])];
};

input.addEventListener("input", isNumber);
