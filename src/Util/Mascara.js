const Mascara = {
  CPF: (cpf) => {
    var onlyNumbers = [];
    var cpfFormatado = [];
    for (var x = 0; x < cpf.length; x++) {
      if (!isNaN(cpf[x])) {
        onlyNumbers.push(cpf[x]);
      }
    }
    for (var y = 0; y < onlyNumbers.length; y++) {
      if (y < 3) {
        cpfFormatado[y] = onlyNumbers[y];
      } else if (y >= 3 && y < 6) {
        cpfFormatado[3] = ".";
        cpfFormatado[y + 1] = onlyNumbers[y];
      } else if (y >= 6 && y < 9) {
        cpfFormatado[7] = ".";
        cpfFormatado[y + 2] = onlyNumbers[y];
      } else if (y >= 9 && y < 11) {
        cpfFormatado[11] = "-";
        cpfFormatado[y + 3] = onlyNumbers[y];
      }
    }

    return cpfFormatado.join("");
  },

  Idade: (idade) => {
    var onlyNumbers = [];
    for (var x = 0; x < idade.length; x++) {
      if (!isNaN(idade[x])) {
        onlyNumbers.push(idade[x]);
      }
    }
    return onlyNumbers.join("");
  },
};

export default Mascara;
