do ->
  KBot.Cah.users = []
  KBot.Cah.hands = []
  KBot.Cah.Round =
    number: NaN
    phase: "select"
    hands: []
    card: null
    judge: 0
    channel: null
  KBot.Cah.used = []
  KBot.Cah.inPlay = false
  KBot.Cah.print = (msg, msgObj, qHandle) ->
    if KBot.waitFor and not qHandle
      return KBot.queue.push ->
        KBot.Cah.print msg, msgObj, true

    KBot.waitFor = true

    if msgObj.to.type is "channel"
      FList.Chat.printMessage
        msg: "[b]K-CAH[/b]: #{msg}"
        to: FList.Chat.TabBar.getTabFromId "channel", KBot.Cah.Round.channel
        from: FList.Chat.identity
        type: "chat"

      FList.Connection.send "MSG " + JSON.stringify
        "channel": KBot.Cah.Round.channel
        "message": "[b]K-CAH[/b]: #{msg}"
    else
      FList.Connection.send "PRI " + JSON.stringify
        "recipient": msgObj.to.id
        "message": "[b]K-CAH[/b]: #{msg}"

KBot.Cmds.cah = do ->
  Cmd = KBot.Cmds
  Cah = KBot.Cah
  Users = Cah.users
  Round = Cah.Round
  Phase = Round.phase
  Hands = Round.hands
  Chat = FList.Chat
  BLACK_CARDS = Cah.Cards.BLACK_CARDS
  WHITE_CARDS = Cah.Cards.WHITE_CARDS

  createHand = (player) ->
    msgObj = 
      to:
        id: player
        type: "user"

    sendString = "Your hand for this round is:\n"
    
    for user in Users
      if user.name is player
        person = user
        break

    while person.hand.length < 8
      card = WHITE_CARDS[~~(Math.random() * WHITE_CARDS.length)]

      while Cah.used.indexOf(card) isnt -1
        card = WHITE_CARDS[~~(Math.random() * WHITE_CARDS.length)]

    person.hand.push card 
    Cah.used.push card

    for card, n in person.hand
      sendString += "#{n}) #{card}\n"

    Cah.print sendString, msgObj

  newRound = ->
    Round.phase = "select"
    Round.number++
    Round.judge++
    Round.judge = if Round.judge is Users.length then 0 else Round.judge
    Round.hands = []

    for user, key in Users
      sendString = "Your hand for this round is:\n"
      
      while user.hand.length < 8
        card = WHITE_CARDS[~~(Math.random() * WHITE_CARDS.length)]

        while Cah.used.indexOf(card) isnt -1
          card = WHITE_CARDS[~~(Math.random() * WHITE_CARDS.length)]

        user.hand.push card 
        Cah.used.push card

      for card, n in user.hand
        sendString += "#{n}) #{card}\n"
      
      if key is Round.judge
        sendString += "\n[b]You are the current judge.[/b]"

      msgObj = 
        to:
          id: user.name
          type: "user"

      Cah.print sendString, msgObj

    black = BLACK_CARDS[~~(Math.random() * BLACK_CARDS.length)]

    Round.card =
      text: black.card
      pick: black.pick

    msgObj = 
      to:
        type: "channel"

    Cah.print(
      "Judge: #{Users[Round.judge].name}\nRound [b]#{Round.number}[/b]\n" +
      "Pick: #{Round.card.pick}\n" +
      "Black Card: #{Round.card.text}"
      , msgObj
    )

  gameInit = ->
    Cah.used = []

    for user, key in Users
      user.hand = []

      sendString = "Your hand for this round is:\n"
      
      for n in [0...8]
        card = WHITE_CARDS[~~(Math.random() * WHITE_CARDS.length)]
   
        while Cah.used.indexOf(card) isnt -1
          card = WHITE_CARDS[~~(Math.random() * WHITE_CARDS.length)]

        Cah.used.push card
        user.hand.push card

        sendString += "#{n}) #{card}\n"
      
      sendString = sendString.slice 0, sendString.length - 1

      if key is Round.judge
        sendString += "\n[b]You are the current judge.[/b]"

      msgObj = 
        to:
          id: user.name
          type: "user"

      Cah.print sendString, msgObj

    black = BLACK_CARDS[~~(Math.random() * BLACK_CARDS.length)]

    Round.card =
      text: black.card
      pick: black.pick

    msgObj = 
      to:
        type: "channel"

    Cah.print(
      "Judge: #{Users[Round.judge].name}\nPick: #{Round.card.pick}\n" +
      "Black Card: #{Round.card.text}"
      , msgObj
    )

  getPlayers = ->
    players = []
    players.push pObj.name for pObj in Users

    return players

  select = (cards, player) ->
    isValid = false
    isJudge = false

    msgObj = 
      to:
        type:"channel"

    for user in Users
      if user.name is player
        pObj = user
        isValid = true
        isJudge = (Users[Round.judge].name is player)
        break

    if isJudge and Round.phase is "judge"
      unless Round.hands[cards[0]]
        return Cah.print(
          "You cannot select a hand that doesn't exist.",
          msgObj
        )

      for user in Users
        if user.name is Round.hands[cards[0]].name
          winner = user

      winner.score += 1

      Cah.print(
        "#{winner.name} has won the round and has a total" +
        " of [b]#{winner.score}[/b] points.",
        msgObj
      )

      return newRound()

    if Round.phase is "select" and isJudge
      return Cah.print(
        "You are this round's judge.",
        msgObj
      )

    if Round.phase is "judge"
      return Cah.print(
        "You are not the judge.",
        msgObj
      )

    unless isValid
      return Cah.print(
        "Cannot select when not in game.",
        msgObj
      )

    if Phase is "judge"
      return Cah.print(
        "Cannot select within judgement phase.",
        msgObj
      )

    unless Cah.inPlay
      return Cah.print(
        "Cannot select when a game is not active.",
        msgObj
      )

    for hand in Round.hands
      if hand.name is player
        return Cah.print(
          "You have already submitted your hand.",
          msgObj
        )

    if cards.length isnt Round.card.pick
      return Cah.print(
        "Invalid card selection where the current card's pick number " +
        "is #{Round.card.pick} and you selected #{cards.length}.",
        msgObj
      )

    hand = {
      name: player
      cards: []
    }
  
    for card, val in cards
      unless pObj.hand[card]
        return Cah.print(
          "Invalid selection: #{val}.",
          msgObj
        )

      hand.cards.push pObj.hand[card]

    for card, val in hand.cards
      pObj.hand.splice pObj.hand.indexOf(card), 1
      Cah.used.splice Cah.used.indexOf(card), 1

    Round.hands.push hand

    console.log Round.hands, hand

    Cah.print "#{player} has submitted their hand.", msgObj

    if Round.hands.length is Users.length - 1
      Round.phase = "judge"

      msg = "#{Users[Round.judge].name} please select a card combo:\n"

      Round.hands = Round.hands.sort(
        ->
          return ~~(Math.random() * 2)
      )

      for hand, key in Round.hands
        msg += "#{key}) #{hand.cards.join ", "}\n"
      
      msg = msg.slice 0, msg.length - 1

      Cah.print msg, msgObj

  funcs =
    quit: (x, player, msgObj) ->
      for user, key in Users
        if user.name is player
          uKey = key
          break

      msgObj = 
        to:
          type:"channel"

      for card in Users[uKey].hand
        Cah.used.splice Cah.used.indexOf(card), 1

      Users.splice uKey, 1

      unless Cah.inPlay
        return Cah.print "#{player} has left the game.", msgObj
      
      if Users.length < 3 and Cah.inPlay
        Cah.inPlay = false
        Cah.used = []
        Round.judge = 0
        Round.number = 0
        Round.card = null
        Round.channel = null

        return Cah.print(
          "#{player} has left the game. Game cannot continue with " +
          "less than 3 players. Reseting.",
          msgObj
        )

      if Round.phase = "judge" and Round.judge is uKey
        Cah.print(
          "#{player} has left the game, and due to being the judge, the " +
          "round must be reset.",
          msgObj
        )

        return newRound()

      Cah.print "#{player} has left the game.", msgObj

      for hand, key in Round.hands
        if hand.name is player
          Round.hands.splice key, 1
          break

      if Round.hands.length is Users.length
        Round.phase = "judge"

        msg = "#{Users[Round.judge].name} please select a card combo:\n"

        Round.hands = Round.hands.sort(
          ->
            return ~~(Math.random() * 2)
        )

        for hand, key in Round.hands
          msg += "#{key}) #{hand.hand.join ", "}\n"
        
        msg = msg.slice 0, msg.length - 1

        Cah.print msg, msgObj

    join: (x, player, msgObj) ->
      for user in Users
        if user.name is player
          return Cah.print "You are already in the game.", msgObj

      pObj = {
        name: player
        score: 0
        hand: []
      }

      Cah.users.push pObj

      Round.channel = msgObj.to.id

      if Cah.inPlay
        createHand player
        return Cah.print "#{player} has joined the game in progress.", msgObj

      return Cah.print(
        "#{player} has joined the game. Current players waiting to " +
        "play: #{getPlayers().join(", ")}",
        msgObj
      )

    start: (x, y, msgObj) ->
      unless Users.length > 2
        return Cah.print(
          "You require at least three players to begin a game."
          "play: #{getPlayers().join(", ")}",
          msgObj
        )

      Cah.print "ROUND 1, FIGHT!", msgObj

      Round.judge = ~~(Math.random() * Users.length)
      Round.number = 1
      Round.phase = "select"

      Cah.inPlay = true

      gameInit msgObj

  # Main CAH handler
  cah = (msg, msgObj) ->
    msg = msg
      .trim()
      .replace new RegExp("/ +/", "g")

    cmd = msg.split(" ")[0]

    if msg.split(",").length > 1
      msg = msg.split ","
      msg[key] = parseInt(card, 10) for card, key in msg

      select(msg, msgObj.from, msgObj)
      return

    unless isNaN parseInt(msg)
      msg = [parseInt(msg, 10)]
      
      select(msg, msgObj.from)
      return

    unless funcs[cmd]
      return Cah.print "Wat?", msgObj

    funcs[cmd] msg, msgObj.from, msgObj
    return

  return cah