//define Variables
const textArea = document.getElementById("searchValue");
const searchBtn = document.getElementById("search");
const word = document.getElementById("word");
const phonetics = document.getElementById("phonetics");
const sound = document.getElementById("sound");
let definitions = document.getElementById("definitions");

//To be set later
let wordData = undefined;
let wordForSearch = undefined;
let audio = document.getElementById("myAudio");

const getWord = async () => {
  if (textArea.value !== "") {
    wordForSearch = textArea.value;

    //fetch for word data
    await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${wordForSearch}`,
      {
        mode: "cors",
      }
    )
      .then((val) => val.json())
      .then((val) => (wordData = val[0]));

    updateDisplay();
  }
};

const updateDisplay = () => {
  //update main word
  word.innerHTML = wordData.word;

  //update definitions
  definitions.innerHTML = "";

  wordData.meanings.forEach((obj) => {
    definitions.innerHTML += `
    <div class="definition">
        <div class="partOfSpeech">${obj.partOfSpeech}</div>
        <div class="explaination">
            ${obj.definitions[0].definition}
        </div>
    </div>
    `;

    //create array to get audio files
    let audios = [];

    //Get audios from phonetics objects
    wordData.phonetics.forEach((obj) => {
      audios.push(obj.audio);
    });

    //update audio source
    audio.src = audios.length > 0 && audios[0] != "" ? audios.at(-1) : "noSrc";
  });
};

//Add validation
const playAudio = () => {
  if (audio.src !== `${window.location.href}noSrc`) {
    audio.play();
  } else {
    alert("no audio for this word");
  }
};

//Default start screen
const startScreen = async () => {
  await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/welcome`, {
    mode: "cors",
  })
    .then((val) => val.json())
    .then((val) => (wordData = val[0]));

  updateDisplay();
};

//event listeners
searchBtn.addEventListener("click", getWord);
sound.addEventListener("click", playAudio);
textArea.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

//startScreen
startScreen();
