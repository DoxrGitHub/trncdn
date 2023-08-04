async function tmp() {
    let raw = await fetch('https://replit.com/graphql', {method: 'POST', body: JSON.stringify({"queries":"query userByUsername($username: String!) {\n  \tuserByUsername(username: $username) {\n    \tdisplayName \n      image \n     }\n  }","variables":{"username":"String!"}}), headers: {"Content-Type": "application/json", "X-Requested-With":"replit", "Referrer":"https://replit.com"}})
    let json = await raw.json()
    console.log(json)
    let name = json.name
    let pfp = json.image
    return {name, pfp}
}
