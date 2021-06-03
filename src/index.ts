import { KAClient } from "./KAClient"

let client = new KAClient()//"pltPbABK8Y9GL5Pb68avRQ")

async function test() {
  let res = await client.fromCredentials("bot3825", "thisIsADumbIdea45")
  console.log("login: ", res)
}

test()







