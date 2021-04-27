const BEE_DEBUG_URL = 'http://localhost:1635'

async function main() {
  const beeDebug = new BeeJs.BeeDebug(BEE_DEBUG_URL)
  try {
    const balances = await beeDebug.getAllBalances()
    const resultDiv = window.document.getElementById('resultDiv')

    const typeofBalances = balances.balances.map(b => ({peer: typeof b.peer, balance: typeof b.balance}))

    console.log(balances, typeofBalances)

    let result = JSON.stringify(balances, null, 2)
    result += JSON.stringify(typeofBalances, null, 2)
    
    resultDiv.innerHTML = result
  } catch(e) {
    console.error(e)
  }
}

main()
