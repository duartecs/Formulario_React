const mascaraIdade = (idade) => {
  var onlyNumbers = [];
  for (var x = 0; x < idade.length; x++) {
    if (!isNaN(idade[x])) {
      onlyNumbers.push(idade[x]);
    }
  }
  return onlyNumbers.join("");
};

export default mascaraIdade;
