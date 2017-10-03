#! /usr/bin/env node

const fetch  = require('./index.js');
const chalk  = require('chalk')
const escape = require('entities')

// pega a o dominio passado por parametro
const domain = (process.argv[ 2 ] || '').toLowerCase()

// variavel onde vai ser armazenado o resultado
let result = {}

// checa a URL https://registro.br/ajax/avail/${url} e retorna o resultado
//const check   = ( url ) => fetch(`https://registro.br/ajax/avail/${url}`).then(res => res.json())

// exibe a mensagem de sucesso caso houver
const success = ( text ) => console.log( chalk.green( `Domínio ${chalk.bold( text )} está disponível`))

// exibe a mensagem de erro caso houver
const error   = ( text ) => console.log(chalk.red(`Domínio ${chalk.bold( text )} não está disponível`))

// exibe o motivo do erro casou houver
const reason  = ( text ) => console.log(chalk.red.bold(escape.decodeHTML( text )))

// exibe a lista de sugestoes caso houver
const suggestions = ( domain, suggestions ) => suggestions.map(suggestion => console.log('\t' + chalk.yellow.bold('- ' + domain + '.' + suggestion)))

// faz o parse do resultado e exibe as validacoes do JSON
const parse   = ( data ) => {
  if (data.available) success( data.fqdn )
  else {
    error( data.fqdn )

    if (data.reason) {
      reason( data.reason )
    }

    if (data.suggestions && data.suggestions.length > 0) {
      console.log(chalk.yellow('Sugestões: '));

      suggestions( data.domain, data.suggestions )
    }
  }
}

// cria o hostname
const hostname = domain.substr(0, domain.indexOf('.'))

// verifica se e um dominio valido
const valid_domain = ( domain ) => {
  if ( !domain ){
    console.log(chalk.red('Por favor, digite uma url válida.'))
    process.exit(1)
  }
}

// verifica se existe a extensao .br no dominio
const extension = ( domain ) => {
  if ( domain.indexOf('.br') === -1 ) {
    console.log(chalk.red('A url informada deve possuir a extensão .br'))
    process.exit(1)
  }
}

// verifica a extensao do hostname
const hostname_length = ( hostname ) => {
  if ( hostname.length < 2 || hostname.length > 26 ) {
    console.log(chalk.red('O Hostname deve ter no mínimo de 2 e máximo de 26 caracteres.'))
    process.exit(1)
  }
}

// verifica se o hostname nao e apenas numeros
const check_only_numbers = ( hostname ) => {
  if ( parseInt(hostname) == hostname ) {
    console.log(chalk.red('O Hostname não deve conter apenas números.'))
    process.exit(1)
  }
}

// verifica se o hostname possui apenas os caracteres especiais permitidos
const special_characters = ( hostname ) => {
  let regex = /([a-z0-9àáâãéêíóôõúüç]+)/g
  let groups = 0
  let matches = []

  while ( matches = regex.exec( hostname ) ) groups++

  if ( groups > 1 ) {
    console.log(chalk.red('O Hostname deve ser a-z, 0-9, hífen e os seguintes caracteres acentuados: à, á, â, ã, é, ê, í, ó, ô, õ, ú, ü, ç.'))
    process.exit(1)
  }
}

// executa a funcao de validacao de domino
valid_domain( domain )

// executa a funcao de validacao da extensao do dominio
extension( domain )

// executa a funcao de validacao do length do hostnam
hostname_length( hostname )

// executa a funcao de validacao de ver se e apenas numeros o hostname
check_only_numbers( hostname )

// executa a funcao de validacao dos caracteres especiais
special_characters( hostname )

// faz a consulta no registro.br para verificar o dominio

fetch( domain ).then(res => {
  result = res
  parse(result)
})
