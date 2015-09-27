(->
if not window.KBot
  window.KBot = {}
else
  clearInterval KBot.queueTick
)

FList.Chat.commands.STA = do ->
  # Private Variables
  Chat = FList.Chat
  Commands = Chat.commands
  TabBar = Chat.TabBar
  Users = Chat.users
  Settings = Chat.Settings
  Channels = Chat.channels
  CONSOLE = TabBar.getTabFromId("console", "console")
  sendSys = (message) ->
    unless Settings.current.consoleRTB
      Chat.printMessage
        msg: message
        from: "System"
        type: "system"

    Chat.printMessage
      msg: message
      to: CONSOLE
      from: "System"
      type: "system"

  # Object Definitions

  # Status server event
  return (args) ->
    status = Users.sanitizeStatus(args.status)
    user = Users.getData(args.character)
    tab = TabBar.getTabFromId("user", user.name)
    isActive = (
      user.name.toLowerCase() is TabBar.activeTab.id and
      TabBar.activeTab.type is "user"
    )
    wantsAlert = (
      Users.isTracked(user.name) and Settings.current.friendNotifications
    )
    isRTB = Settings.current.consoleRTB

    if user.status isnt "idle" and status isnt "Idle"
      alert = true

    args.statusmsg = args.statusmsg.replace(
      /\[icon\].*\[\/icon\]/g, ""
    )

    user.status = status
    user.statusmsg = args.statusmsg
    sysMessage = "[user]#{user.name}[/user] changed status to #{status}" +
      if user.statusmsg then ", #{user.statusmsg}"

    Users.setData(user.name, user)

    if alert and args.statusmsg.trim()
      KBot.Stats.setNew args.statusmsg

    if user.name is Chat.identity
      Chat.Status.set(status, Chat.desanitize(user.statusmsg))

    unless tab
      if wantsAlert and alert
        sendSys(sysMessage)

      if TabBar.activeTab is "channel"
        Chat.UserBar.updateUser(user.name)

      return

    if isActive
      if alert
        sendSys(sysMessage)

        Chat.InfoBar.update()
    else
      if wantsAlert or not tab.closed and alert
        sendSys(sysMessage)

    TabBar.updateTooltip(tab)

    if TabBar.activeTab is "channel"
      Chat.UserBar.updateUser(user.name)

FList.Chat.commands.MSG = (params) ->
    if jQuery.inArray(params.character.toLowerCase(), FList.Chat.ignoreList) isnt -1
      return

    message = params.message

    if params.channel.toLowerCase() is "frontpage"
      message = message
        .replace /\[icon\]/g, "[user]"
        .replace /\[\/icon\]/g, "[/user]"

    messagetype = "chat"

    if FList.Chat.Roleplay.isRoleplay message
        message = message.substring 3
        messagetype = "rp"

    KBot.read
      "msg": message
      "to": FList.Chat.TabBar.getTabFromId "channel", params.channel
      "from": params.character
      "type": messagetype

    FList.Chat.printMessage
      "msg": message
      "to": FList.Chat.TabBar.getTabFromId "channel", params.channel
      "from": params.character 
      "type": messagetype

FList.Chat.Input.handle = (msg) ->
  local = FList.Chat
  pass = () ->
    $("#message-field").val ""
  curTab = local.TabBar.activeTab
  channeldata = local.channels.getData curTab.id
  isRp = msg.indexOf("/me") is 0
  msgType = "chat"
  isCmd = msg.charAt(0) is "/"
  isWarn = msg.indexOf("/warn ") is 0

  msgType = "rp" if isRp

  if curTab.type is "console"
    if isCmd and not isRp and not isWarn
      return @parse msg

    return FList.Common_displayError "You cannot chat in the console."
  if curTab.type is "channel"
    if isCmd and not isRp and not isWarn
      return @parse msg

    if channeldata.mode is "ads"
      return local.Roleplay.sendAd curTab.id, msg

    if msg.trim()
      if local.Settings.current.html5Audio
        local.Sound.playSound "chat"

      FList.Connection.send "MSG " +
        JSON.stringify
          "channel": curTab.id
          "message": msg

      if isRp
        msg = msg.substr 3

      msg = local.Input.sanitize msg

      # Hook for KBot
      KBot.read
        "msg": msg
        "to": local.TabBar.getTabFromId "channel", curTab.id
        "from": local.identity
        "type": msgType

      local.printMessage
        "msg": msg
        "to": local.TabBar.getTabFromId "channel", curTab.id
        "from": local.identity
        "type": msgType

      KBot.botWait = true

      return pass()

  if isCmd and not isRp and not isWarn
    return @parse msg

  if msg.trim()
    if local.Settings.current.html5Audio
      local.Sound.playSound "chat"

    FList.Connection.send "PRI " +
      JSON.stringify
        "recipient": curTab.id
        "message": msg

    if isRp
      msg = msg.substr 3

    msg = local.Input.sanitize msg

    local.Logs.saveLogs(
      local.identity,
        "msg": msg
        "kind": msgType
        "to": curTab.id.toLowerCase()
    )

    # Hook for KBot
    KBot.read
      "msg": msg
      "to": local.TabBar.getTabFromId "user", curTab.id
      "from": local.identity
      "type": msgType

    local.printMessage
      "msg": msg
      "from": local.identity
      "type": msgType

    curTab.metyping = false
    curTab.mewaiting = false
    
    KBot.botWait = true

    setTimeout ->
        KBot.botWait = false
      , 1000

    return pass()

FList.Chat.commands.PRI = (params) ->
  local = FList.Chat
  isIgnored = 
    $.inArray(params.character.toLowerCase(), local.ignoreList) isnt -1

  if isIgnored
    return FList.Connection.send 'IGN ' +
      JSON.stringify
        action: 'notify',
        character: params.character

  message = params.message
  
  messagetype = "chat"
  if local.Roleplay.isRoleplay message
    message = message.substr 3
    messagetype = "rp"

  tab = local.TabBar.getTabFromId 'user', params.character.toLowerCase()

  if not tab
    local.openPrivateChat params.character, false
  else
    tab.tab
      .children ".tpn" 
      .removeClass "tpn-paused"
      .hide()
    if tab.closed
      tab.tab.show()
      tab.closed = false

  local.Logs.saveLogs(
    params.character,
      msg: message
      kind: messagetype
      to: params.character.toLowerCase()
  );
  local.printMessage
    msg: message,
    to: local.TabBar.getTabFromId 'user', params.character
    from: params.character, type: messagetype

  KBot.read(
    msg: message
    to: local.TabBar.getTabFromId 'user', params.character
    from: params.character
    type: messagetype
  )

window.KBot = do ->
  Chat = FList.Chat
  Channels = Chat.channels
  Con = FList.Connection


  # b p d
  # 0 0 0 none
  # 0 0 1 male
  # 0 1 0 cuntboy
  # 0 1 1 maleherm
  # 1 0 1 shemale
  # 1 1 0 female
  # 1 1 1 herm
  genders = 
    None: 0
    Transgender: 0
    Male: 1
    Cuntboy: 2
    'Male-Herm': 3
    Shemale: 5
    Female: 6
    Herm: 7

  whitelist =
    "Melvin": true
    "Teal Deer": true
    "Kali Trixtan": true
    "Kira": true
    "FreeFull": true
    "Vera": true
    "Phuu Pah": true
    "slimCat": true
    "Scarlett": true

  read = (msgObj) ->
    if msgObj.msg.charAt(0) isnt "!"
      return

    return @handle msgObj

  waitFor = false

  queue = []

  queueTick = setInterval ->
      if KBot.botWait
        return KBot.botWait = false

      if not KBot.queue.length
        return KBot.waitFor = false

      if KBot.waitFor
        return KBot.queue.shift()()
    , 1000

  handle = (msgObj, qHandled) ->
    msgObj.msg = msgObj.msg
      .replace /\&gt\;/g, ">"
      .replace /\&lt\;/g, "<"
      .replace /\&amp\;/g, "&"
      .replace /\&91\;/g, "["
      .replace /\&93\;/g, "]"

    command = msgObj.msg.split(" ")[0].slice 1

    if not KBot.Cmds[command]
      return

    if KBot.waitFor and not qHandled
      return KBot.queue.push ->
        KBot.handle msgObj, true

    @waitFor = true

    retMsg = KBot.Cmds[command](
      msgObj.msg
        .split " "
        .slice 1
        .join(" "),
      msgObj
    )

    if command is "cah"
      return

    if msgObj.from is FList.Chat.identity
      return setTimeout (->
        FList.Chat.printMessage
          "msg": "[b]KBot[/b]: #{retMsg}"
          "to": msgObj.to
          "from": Chat.identity
          "type": msgObj.type
        if msgObj.to.type is "channel"
          return Con.send "MSG " + JSON.stringify
            "channel": msgObj.to.id
            "message": "[b]KBot[/b]: #{Chat.desanitize(retMsg + '')}"

        return Con.send "PRI " + JSON.stringify
          "recipient": msgObj.from.id
          "message": "[b]KBot[/b]: #{Chat.desanitize(retMsg + '')}"
      ), 1000

    FList.Chat.printMessage
      "msg": "[b]KBot[/b]: #{retMsg}"
      "to": msgObj.to
      "from": msgObj.from
      "type": msgObj.type

    if msgObj.to.type is "channel"
      return FList.Connection.send "MSG " + JSON.stringify
        "channel": msgObj.to.id
        "message": "[b]KBot[/b]: #{retMsg}"

    return FList.Connection.send "PRI " + JSON.stringify
      "recipient": msgObj.from.id
      "message": "[b]KBot[/b]: #{retMsg}"

  Cmds = {
    fmtpainbow: (string) ->
      # Syntax: !painfmt all|alt|perX string
      # Requires either alt or all as fmt 
      colors = [
        "red"
        "orange"
        "yellow"
        "green"
        "cyan"
        "blue"
        "purple"
      ]

      counter = 0;

      nsus = String.fromCharCode(0x332)

      string = string
        .trim()
        .split(" ")
      
      mode = string.shift()

      string = string.join(" ")

      if mode isnt "all" and mode isnt "alt" and mode.indexOf("per") isnt 0
        return (
          "This command requires a mode of formatting." +
          " Formats: All, Alt, PerX."
        )

      if mode is "all"
        string = string.split(" ")
        interval = ~~(string.join('').length / 7)
        offset = (string.join('').length / 7 - 1) * 7

        unless interval
          return ( 
            "Cannot format a string of less than" +
            " 7 alphabetical characters"
          )

        for word, i in string
          word = word.split('')
          for char, k in word
            unless counter
              word[k] = "[color=red]#{char}"
            else
              if counter / interval > 6
                continue

              if offset > 1 and not isOffset
                offset--
                isOffset = true
                continue
              unless counter % interval
                word[k] = (
                  "[/color][color=#{colors[counter / interval]}]" +
                  "#{word[k]}"
                )
                isOffset = false
            counter++
          string[i] = word.join('')
        string = "#{string.join(" ")}[/color]"
      if mode is "alt"
        string = string.split(" ")

        for word, i in string
          word = word.split('')
          for char, k in word
            if char is " "
              continue

            word[k] = ( 
              "[color=#{colors[(counter + 2) % 7]}]#{nsus}[/color]" +
              "[color=#{colors[counter % 7]}]#{char}[/color]" +
              "[color=#{colors[(counter + 2) % 7]}]#{nsus}[/color]"
            )

            counter++
          string[i] = word.join('')

        string = string.join(" ")
      if mode.slice(0, 3) is "per"
        return

      return string

    roomsearch: (str) ->
      result = ""

      str = new RegExp str, "i"

      channels = Chat.privateChannels.map(
          (v, k) ->
            return v.title
        )
        .concat(
          Chat.publicChannels.map(
            (v, k) ->
              return v.id
        )
      )

      channels = channels.filter (a) ->
        return str.test a

      if channels.length > 25
        for i in [0...25]
          result += "#{channels[i]}[b]|[/b]"

        result = result.slice 0, result.length - 1

        result += " [b]...#{channels.length - 25} more."
      else
        result = channels.join '[b]|[/b]'

      return result

    csrun: (str, msgObj) ->
      unless KBot.whitelist[msgObj.from]
        return "[i]Access Denied.[/i]"

      try
        # CoffeeScript to attempt to evaluate
        return CoffeeScript.eval str 
      catch e
        # Return eval error
        return e

    cscompile: (str) ->
      return "\n" + 
        try
          CoffeeScript.compile(str)
        catch e
          e
    bytes: (str) ->
      bytes = 0
      
      codePoints = []

      padFour = (str) ->
        while str.length < 4
          str = "0#{str}"

        return str

      getBytes = (num) ->
        switch true
          when num < 0x80 then 1
          when num < 0x800 then 2
          when num < 0x10000 then 3
          else 4

      for itr in str
        curCharCode = itr.charCodeAt 0

        bytes += getBytes curCharCode

        codePoints.push(
          "#{itr}:U+" + padFour curCharCode.toString(16).toUpperCase()
        )

      return "#{bytes} byte" + 
        if bytes is 1 then '' else 's' +
        ". [#{codePoints.join ', '}]"

    "eval": (str, msgObj) ->
      unless KBot.whitelist[msgObj.from]
        return "[i]Access Denied.[/i]"

      try
        return eval(str)
      catch e
        return e

    eightball: ->
      answers = [
        "It is certain."
        "It is decidedly so."
        "Without a doubt."
        "Yes, definitely."
        "You may rely on it."
        "As I see it, yes."
        "Most likely."
        "Outlook: Good."
        "Yes."
        "Signs point to yes."
        "Reply hazy -- try again."
        "Ask again later."
        "Better not tell you now."
        "Cannot predict now."
        "Concentrate, and ask again."
        "Don't count on it."
        "My reply is no."
        "My sources say no."
        "Outlook not so good."
        "Very doubtful."
      ]

      return answers[~~(Math.random() * answers.length)]

    bored: (x, msgObj) ->
      player = msgObj.from
      gender = genders[FList.Chat.users.getData(player).gender]

      actionsSpec = [
        [
          "spin your dick around like a helicopter shouting 'Soisoisoi!' at the top of your lungs."
          "fuck a pie"
          "fellate yourself"
          "jam your dick in someone's ass"
          "cockslap someone"
          "facefuck someone"
          "earfuck someone"
          "perform ritualistic coitus with someone"
          "rub your cock's tip on someone's nose and give them a good bapping with your 'pimp-cane'"
          "smear your phallus upon thyne own lips"
          "give some poor soul a mushroom stamp"
          "wash your willy"
          "insert your member into the family dog's anus"
          "rest your balls on someone's chin"
          "toss your salad"
          "play with your dick"
          "fap"
          "use a pump on your penis"
        ], [
          "schlick"
        ], [
          "roll breasts"
        ]
      ]
    randcah: (n) ->
      WHITE_CARDS = KBot.Cah.Cards.WHITE_CARDS
      BLACK_CARDS = KBot.Cah.Cards.BLACK_CARDS

      getWhite = ->
        text = WHITE_CARDS[~~(Math.random() * WHITE_CARDS.length)]
        text = text.substring 0, text.length - 1
        text = text.toLowerCase()
        return text

      bCard = BLACK_CARDS[~~(Math.random() * BLACK_CARDS.length)]

      n = parseInt n, 10

      unless isNaN n
        n = if n > 3 or n <= 0 then 3 else n

        while bCard.pick isnt n
          bCard = BLACK_CARDS[~~(Math.random() * BLACK_CARDS.length)]

      if bCard.pick is 1 and not bCard.card.match /[_]+/g
        line = getWhite()
        line = line.split ''
        line[0] = line[0].toUpperCase()
        line = line.join ''
        line = "#{bCard.card} [b]#{line}.[/b]"
      else
        line = bCard.card.replace(/\_+/g, "%%")

        if bCard.pick > 1
          line = line.replace("%%", "[b]#{getWhite()}[/b]") for [0...bCard.pick]
        else
          line = line.replace /\%\%/g, "[b]#{getWhite()}[/b]"
      
          if line.indexOf("[b]") is 0
            line = line.split ''
            line[3] = line[3].toUpperCase()
            line = line.join ''

      return line

    findstatus: (pattern) ->
      pattern = new RegExp(pattern, "gi")
      matches = KBot.Stats.getMatches pattern

      unless matches.length
        return "No results found."

      return "#{matches.length} result(s) found, first 25 results:\n" +
        "#{matches.slice(0, 25).join('[b]|[/b]')}"

    erodice: (msg, msgObj) ->
      actions = [
        "Any"
        "Fuck"
        "Kiss"
        "Suck"
        "Lick"
        "Nip"
        "Grind" 
        "Rub"
      ]

      areas = [
        "Any"
        "Lips"
        "Cock/Cooch"
        "Nipple"
        "Breast"
        "Neck"
        "Tail"
        "Ass"
        "Gooch"
        "Balls"
      ]

      r1 = ~~(Math.random() * areas.length)
      r2 = ~~(Math.random() * actions.length)

      return "[b]#{msgObj.from}[/b] rolls: [b]#{r1}[/b] " +
          "for area ([i]#{areas[r1]}[/i]) and " +
          "[b]#{r2}[/b] for action ([i]#{actions[r2]}[/i])"

    addsentence: (input) ->
      input = input.trim()

      unless input
        return 'Syntax error. No value defined.'

      KBot.Templates.push input
      
      return "\"[i]#{input}[/i]\" added to the list of sentence templates."

    removesentence: (input) ->
      input = parseInt input, 10

      unless KBot.Templates[input]
        return 'Invalid index id.'

      KBot.templates.splice input, 1

      return "Removed template #{input}."

    addword: (input) ->
      input = input.split(' ')
      command = input.shift().toLowerCase()
      input = input.join(' ').trim()

      unless input
        return 'Syntax error. No value defined.'

      unless KBot.Words[command]
        return 'Invalid word type addition. Valid types are: ' +
          '"thing", "things", "action" and "actions".'

      KBot.Words[command].push input

      return "Added \"[i]#{input}[/i]\" to the list of \"[i]#{command}[/i]\""

    fillsentence: (input) ->
      inserts = KBot.Word 
      
      template = input
      
      insertNew = (type, string) ->
        types = inserts[type]
        selection = types[~~(Math.random() * types.length)]

        return string.replace "[#{type}]", selection

      tPoints = template.match /\[[^\[\]]+\]/g

      for itr in tPoints
        curType = itr.replace /\[|\]/g, ""

        template = insertNew curType, template

      return template.charAt(0).toUpperCase() + template.slice 1

    listsentences: ->
      output = ""

      for i in [0...KBot.Templates.length]
        output += "[b]${i}[/b]: '#{KBot.Templates[i]}',"

      output = output.slice 0, output.length - 1

      return "[b]List of sentence templates by id:[/b]\n#{output}."

    sentence: ->
      templates = KBot.Templates

      inserts = KBot.Words 

      template = templates[~~(Math.random() * templates.length)]

      insertNew = (type, string) ->
        types = inserts[type]
        selection = types[~~(Math.random() * types.length)]

        return string.replace "[#{type}]", selection

      tPoints = template.match /\[[^\[\]]+\]/g

      for itr in tPoints
        curType = itr.replace /\[|\]/g, ""

        template = insertNew curType, template

      return template.charAt(0).toUpperCase() + template.slice 1
  }

  Stats = do ->
    ###
    # Status object conversion and property filtering to an array of statuses
    # @params {RegExp} pattern 
    # @returns {Array}
    ###
    getMatches = (pattern) ->
      return @Status.filter (val) ->
        return pattern.test val

    setNew = (status) ->
      if @Status.indexOf(status) is -1
        return @Status.push status

      return null

    return {
      Status: []
      getMatches
      setNew
    }

  Cah =
    Cards: {"BLACK_CARDS":[{"card":"Why can't I sleep at night?","pick":1},{"card":"I got 99 problems but ____ ain't one.","pick":1},{"card":"What's a girl's best friend?","pick":1},{"card":"What's that smell?","pick":1},{"card":"____? There's an app for that.","pick":1},{"card":"This is the way the world ends \\ This is the way the world ends \\ Not with a bang but with ____.","pick":1},{"card":"What is Batman's guilty pleasure?","pick":1},{"card":"TSA guidelines now prohibit ____ on airplanes.","pick":1},{"card":"What ended my last relationship?","pick":1},{"card":"MTV's new reality show features eight washed-up celebrities living with ____.","pick":1},{"card":"I drink to forget ____.","pick":1},{"card":"I'm sorry, Professor, but I couldn't complete my homework because of ____.","pick":1},{"card":"During Picasso's often-overlooked Brown Period, he produced hundreds of paintings of ____.","pick":1},{"card":"Alternative medicine is now embracing the curative powers of ____.","pick":1},{"card":"What's that sound?","pick":1},{"card":"What's the next Happy Meal toy?","pick":1},{"card":"Who stole the cookies from the cookie jar?","pick":1},{"card":"It's a pity that kids these days are all getting involved with ____.","pick":1},{"card":"Anthropologists have recently discovered a primitive tribe that worships ____.","pick":1},{"card":"In the new Disney Channel Original Movie, Hannah Montana struggles with ____ for the first time.","pick":1},{"card":"____. That's how I want to die.","pick":1},{"card":"I wish I hadn't lost the instruction manual for ____.","pick":1},{"card":"What does Dick Cheney prefer?","pick":1},{"card":"What's the most emo?","pick":1},{"card":"Instead of coal, Santa now gives the bad children ____.","pick":1},{"card":"What's the next superhero?","pick":1},{"card":"In 1,000 years, when paper money is but a distant memory, ____ will be our currency.","pick":1},{"card":"Next from J.K. Rowling: Harry Potter and the Chamber of ____.","pick":1},{"card":"A romantic, candlelit dinner would be incomplete without ____.","pick":1},{"card":"White people like ____.","pick":1},{"card":"____. Betcha can't have just one!","pick":1},{"card":"War!\n\nWhat is it good for?","pick":1},{"card":"BILLY MAYS HERE FOR ____.","pick":1},{"card":"____. High five, bro.","pick":1},{"card":"During sex, I like to think about ____.","pick":1},{"card":"What did I bring back from Mexico?","pick":1},{"card":"What are my parents hiding from me?","pick":1},{"card":"What will always get you laid?","pick":1},{"card":"When I'm in prison, I'll have ____ smuggled in.","pick":1},{"card":"What would grandma find disturbing, yet oddly charming?","pick":1},{"card":"What did the U.S. airdrop to the children of Afghanistan?","pick":1},{"card":"What helps Obama unwind?","pick":1},{"card":"What's there a ton of in heaven?","pick":1},{"card":"Major League Baseball has banned ____ for giving players an unfair advantage.","pick":1},{"card":"When I am a billionare, I shall erect a 50-foot statue to commemorate ____.","pick":1},{"card":"What's the new fad diet?","pick":1},{"card":"When I am the President of the United States, I will create the Department of ____.","pick":1},{"card":"____. It's a trap!","pick":1},{"card":"How am I maintaining my relationship status?","pick":1},{"card":"What will I bring back in time to convince people that I am a powerful wizard?","pick":1},{"card":"What don't you want to find in your Chinese food?","pick":1},{"card":"Due to a PR fiasco, Walmart no longer offers ____.","pick":1},{"card":"After Hurricane Katrina, Sean Penn brought ____ to all the people of New Orleans.","pick":1},{"card":"While the United States raced the Soviet Union to the moon, the Mexican government funneled millions of pesos into research on ____.","pick":1},{"card":"Coming to Broadway this season, ____: The Musical.","pick":1},{"card":"What's my secret power?","pick":1},{"card":"What gives me uncontrollable gas?","pick":1},{"card":"But before I kill you, Mr. Bond, I must show you ____.","pick":1},{"card":"What never fails to liven up the party?","pick":1},{"card":"What am I giving up for Lent?","pick":1},{"card":"What do old people smell like? ","pick":1},{"card":"The class field trip was completely ruined by ____.","pick":1},{"card":"When Pharaoh remained unmoved, Moses called down a plague of ____.","pick":1},{"card":"I do not know with which weapons World War III will be fought, but World War IV will be fought with ____.","pick":1},{"card":"Life was difficult for cavemen before ____.","pick":1},{"card":"What's Teach for America using to inspire inner city students to succeed?","pick":1},{"card":"What's the crustiest?","pick":1},{"card":"In Michael Jackson's final moments, he thought about ____.","pick":1},{"card":"In an attempt to reach a wider audience, the Smithsonian Museum of Natural History has opened an interactive exhibit on ____.","pick":1},{"card":"Why do I hurt all over?","pick":1},{"card":"Studies show that lab rats navigate mazes 50% faster after being exposed to ____.","pick":1},{"card":"Why am I sticky?","pick":1},{"card":"What's my anti-drug?","pick":1},{"card":"And the Academy Award for ____ goes to ____.","pick":2},{"card":"For my next trick, I will pull ____ out of ____.","pick":2},{"card":"____: Good to the last drop.","pick":1},{"card":"What did Vin Diesel eat for dinner?","pick":1},{"card":"____: kid-tested, mother-approved.","pick":1},{"card":"What gets better with age?","pick":1},{"card":"I never truly understood ____ until I encountered ____.","pick":2},{"card":"Rumor has it that Vladimir Putin's favorite delicacy is ____ stuffed with ____.","pick":2},{"card":"Lifetime presents ____, the story of ____.","pick":2},{"card":"Make a haiku.","pick":3},{"card":"In M. Night Shyamalan's new movie, Bruce Willis discovers that ____ had really been ____ all along.","pick":2},{"card":"____ is a slippery slope that leads to ____.","pick":2},{"card":"In his new summer comedy, Rob Schneider is ____ trapped in the body of ____.","pick":2},{"card":"In a world ravaged by ____, our only solace is ____.","pick":2},{"card":"That's right, I killed ____. How, you ask? ____.","pick":2},{"card":"When I was tripping on acid, ____ turned into ____.","pick":2},{"card":"____ + ____ = ____.","pick":3},{"card":"What's the next superhero/sidekick duo?","pick":2},{"card":"Dear Abby,\n\nI'm having some trouble with ____ and would like your advice.","pick":1},{"card":"After the earthquake, Sean Penn brought ____ to the people of Haiti.","pick":1},{"card":"In L.A. County Jail, word is you can trade 200 cigarettes for ____.","pick":1},{"card":"Maybe she's born with it. Maybe it's ____.","pick":1},{"card":"Life for American Indians was forever changed when the White Man introduced them to ____.","pick":1},{"card":"Next on ESPN2, the World Series of ____.","pick":1},{"card":"Step 1: ____. Step 2: ____. Step 3: Profit.","pick":2},{"card":"Here is the church\nHere is the steeple\nOpen the doors\nAnd there is ____.","pick":1},{"card":"How did I lose my virginity?","pick":1},{"card":"During his childhood, Salvador Dalí; produced hundreds of paintings of ____.","pick":1},{"card":"In 1,000 years, when paper money is a distant memory, how will we pay for goods and services?","pick":1},{"card":"What don't you want to find in your Kung Pao chicken?","pick":1},{"card":"The Smithsonian Museum of Natural History has just opened an exhibit on ____.","pick":1},{"card":"Daddy, why is Mommy crying?","pick":1},{"card":"What brought the orgy to a grinding halt?","pick":1},{"card":"When I pooped, what came out of my butt?","pick":1},{"card":"In the distant future, historians will agree that ____ marked the beginning of America's decline.","pick":1},{"card":"What's the gift that keeps on giving?","pick":1},{"card":"This season on Man vs. Wild, Bear Grylls must survive in the depths of the Amazon with only ____ and his wits.","pick":1},{"card":"Michael Bay's new three-hour action epic pits ____ against ____.","pick":2},{"card":"And I would have gotten away with it, too, if it hadn't been for ____!","pick":1},{"card":"In a pinch, ____ can be a suitable substitute for ____.","pick":2},{"card":"What has been making life difficult at the nudist colony?","pick":1},{"card":"Science will never explain the origin of ____.","pick":1},{"card":"In Rome, there are whisperings that the Vatican has a secret room devoted to ____.","pick":1},{"card":"I learned the hard way that you can't cheer up a grieving friend with ____.","pick":1},{"card":"When all else fails, I can always masturbate to ____.","pick":1},{"card":"An international tribunal has found ____ guilty of ____.","pick":2},{"card":"In its new tourism campaign, Detroit proudly proclaims that it has finally eliminated ____.","pick":1},{"card":"In his new self-produced album, Kanye West raps over the sounds of ____.","pick":1},{"card":"The socialist governments of Scandinavia have declared that access to ____ is a basic human right.","pick":1},{"card":"He who controls ____ controls the world.","pick":1},{"card":"Dear Sir or Madam, We regret to inform you that the Office of ____ has denied your request for ____.","pick":2},{"card":"The CIA now interrogates enemy agents by repeatedly subjecting them to ____.","pick":1},{"card":"____ would be woefully incomplete without ____.","pick":2},{"card":"During his midlife crisis, my dad got really into ____.","pick":1},{"card":"Before I run for president, I must destroy all evidence of my involvement with ____.","pick":1},{"card":"My new favorite porn star is Joey \"____\" McGee.","pick":1},{"card":"In his newest and most difficult stunt, David Blaine must escape from ____.","pick":1},{"card":"This is your captain speaking. Fasten your seatbelts and prepare for ____.","pick":1},{"card":"My mom freaked out when she looked at my browser history and found ____.com/____.","pick":2},{"card":"The Five Stages of Grief: denial, anger, bargaining, ____, acceptance.","pick":1},{"card":"Members of New York's social elite are paying thousands of dollars just to experience ____.","pick":1},{"card":"I went from ____ to ____, all thanks to ____.","pick":3},{"card":"Little Miss Muffet Sat on a tuffet, Eating her curds and ____.","pick":1},{"card":"This month's Cosmo: \"Spice up your sex life by bringing ____ into the bedroom.\"","pick":1},{"card":"If God didn't want us to enjoy ____, he wouldn't have given us ____.","pick":2},{"card":"My country, 'tis of thee, sweet land of ____.","pick":1},{"card":"After months of debate, the Occupy Wall Street General Assembly could only agree on \"More ____!\"","pick":1},{"card":"I spent my whole life working toward ____, only to have it ruined by ____.","pick":2},{"card":"Next time on Dr. Phil: How to talk to your child about ____.","pick":1},{"card":"Only two things in life are certain: death and ____.","pick":1},{"card":"Everyone down on the ground! We don't want to hurt anyone. We're just here for ____.","pick":1},{"card":"The healing process began when I joined a support group for victims of ____.","pick":1},{"card":"The votes are in, and the new high school mascot is ____.","pick":1},{"card":"Charades was ruined for me forever when my mom had to act out ____.","pick":1},{"card":"Before ____, all we had was ____.","pick":2},{"card":"Tonight on 20/20: What you don't know about ____ could kill you.","pick":1},{"card":"You haven't truly lived until you've experienced ____ and ____ at the same time.","pick":2},{"card":"Hey baby, come back to my place and I'll show you ____.","pick":1},{"card":"My gym teacher got fired for adding ____ to the obstacle course.","pick":1},{"card":"Finally! A service that delivers ____ right to your door.","pick":1},{"card":"To prepare for his upcoming role, Daniel Day-Lewis immersed himself in the world of ____.","pick":1},{"card":"My life is ruled by a vicious cycle of ____ and ____.","pick":2},{"card":"During high school, I never really fit in until I found ____ club.","pick":1},{"card":"Money can't buy me love, but it can buy me ____.","pick":1},{"card":"Listen, son. If you want to get involved with ____, I won't stop you. Just steer clear of ____.","pick":2},{"card":"A successful job interview begins with a firm handshake and ends with ____.","pick":1},{"card":"Call the law offices of Goldstein & Goldstein, because no one should have to tolerate ____ in the workplace.","pick":1},{"card":"Lovin' you is easy 'cause you're ____.","pick":1},{"card":"The blind date was going horribly until we discovered our shared interest in ____.","pick":1},{"card":"What left this stain on my couch?","pick":1},{"card":"Turns out that ____-Man was neither the hero we needed nor wanted.","pick":1},{"card":"After months of practice with ____, I think I'm finally ready for ____.","pick":2},{"card":"In the seventh circle of Hell, sinners must endure ____ for all eternity.","pick":1},{"card":"As part of his daily regimen, Anderson Cooper sets aside 15 minutes for ____.","pick":1},{"card":"When you get right down to it, ____ is just ____.","pick":2},{"card":"Having problems with ____? Try ____!","pick":2},{"card":"And what did [i]you[/i] bring for show and tell?","pick":1},{"card":"I'm not like the rest of you. I'm too rich and busy for ____.","pick":1},{"card":"With enough time and pressure, ____ will turn into ____.","pick":2},{"card":"____: Hours of fun. Easy to use. Perfect for ____!","pick":2},{"card":"____. Awesome in theory, kind of a mess in practice.","pick":1},{"card":"As part of his contract, Prince won't perform without ____ in his dressing room.","pick":1},{"card":"Man, this is bullshit. Fuck ____.","pick":1},{"card":"Dear Leader Kim Jong-un,\nour village praises your infinite wisdom with a humble offering of ____.","pick":1},{"card":"____ may pass, but ____ will last forever.","pick":2},{"card":"She's up all night for good fun.\nI'm up all night for ____.","pick":1},{"card":"Alright, bros. Our frat house is condemned, and all the hot slampieces are over at Gamma Phi. The time has come to commence Operation ____.","pick":1},{"card":"The Japanese have developed a smaller, more efficient version of ____.","pick":1},{"card":"In return for my soul, the Devil promised me ____, but all I got was ____.","pick":2},{"card":"You guys, I saw this crazy movie last night. It opens on ____, and then there's some stuff about ____, and then it ends with ____.","pick":3},{"card":"____ will never be the same after ____.","pick":2},{"card":"Wes Anderson's new film tells the story of a precocious child coming to terms with ____.","pick":1},{"card":"In the beginning, there was ____.\nAnd the Lord said, \"Let there be ____.\"","pick":2},{"card":"What's fun until it gets weird?","pick":1},{"card":"We never did find ____, but along the way we sure learned a lot about ____.","pick":2},{"card":"You've seen the bearded lady!\nYou've seen the ring of fire!\nNow, ladies and gentlemen, feast your eyes upon ____!","pick":1},{"card":"How am I compensating for my tiny penis?","pick":1},{"card":"I'm sorry, sir, but we don't allow ____ at the country club.","pick":1},{"card":"2 AM in the city that never sleeps. The door swings open and [i]she[/i] walks in, legs up to here. Something in her eyes tells me she's looking for ____.","pick":1},{"card":"As king, how will I keep the peasants in line?","pick":1},{"card":"Oprah's book of the month is \"____ For ____: A Story of Hope.\"","pick":2},{"card":"Do [i]not[/i] fuck with me! I am literally ____ right now.","pick":1},{"card":"Adventure.\nRomance.\n____.\n\nFrom Paramount Pictures, \"____.\"","pick":2},{"card":"I am become ____, destroyer of ____!","pick":2},{"card":"It lurks in the night. It hungers for flesh. This summer, no one is safe from ____.","pick":1},{"card":"If you can't handle ____, you'd better stay away from ____.","pick":2},{"card":"This is the prime of my life. I'm young, hot, and full of ____.","pick":1},{"card":"I'm pretty sure I'm high right now, because I'm absolutely mesmerized by ____.","pick":1},{"card":"This year's hottest album is \"____\" by ____.","pick":2},{"card":"Every step towards ____ gets me a little closer to ____.","pick":2},{"card":"Forget everything you know about ____, because now we've supercharged it with ____!","pick":2},{"card":"Honey, I have a new role-play I want to try tonight! You can be ____, and I'll be ____.","pick":2},{"card":"I used to be an adventurer like you, then I took a/an ____ in the ____.","pick":2},{"card":"You've got to check out ____ Fluxx!","pick":1},{"card":"For the love of GOD, and all that is HOLY, ____!!","pick":1},{"card":"The new Operating System will be called ____.","pick":1},{"card":"Yes, Mr. Death... I'll play you a game! But not chess! My game is ____.","pick":1},{"card":"I cannot preach hate and warfare when I am a disciple of ____.","pick":1},{"card":"Call of Duty Modern Warfare 37: War of ____!","pick":1},{"card":"In brightest day, in blackest night, no ____ shall escape my sight.","pick":1},{"card":"My next video turorial covers ____.","pick":1},{"card":"We found a map Charlie! A map to ____ Mountain!","pick":1},{"card":"Honey badger don't give a ____!","pick":1},{"card":"Good. Bad. I'm the guy with the ____.","pick":1},{"card":"Hail to the ____, baby.","pick":1},{"card":"Shop smart. Shop ____.","pick":1},{"card":"Alright you Primitive Screwheads, listen up! You see this? This... is my ____!","pick":1},{"card":"Every sperm is ____.","pick":1},{"card":"I see you have the machine that goes ____.","pick":1},{"card":"I seek The Holy ____.","pick":1},{"card":"How will we stop an army of the dead at our castle walls?","pick":1},{"card":"Faster than a speeding ____! More powerful than a ____!","pick":2},{"card":"Fighting a never-ending battle for truth, justice, and the American ____!","pick":1},{"card":"Don't make me ____. You wouldn't like me when I'm ____.","pick":1},{"card":"With great power comes great ____.","pick":1},{"card":"I'm loyal to nothing, General - except the ____.","pick":1},{"card":"Patriotism doesn't automatically equal ____.","pick":1},{"card":"Disguised as ____, mild-mannered ____. ","pick":2},{"card":"Able to leap ____ in a single bound! ","pick":1},{"card":"These aren't the ____ you're looking for.","pick":1},{"card":"We're gonna need a bigger ____.","pick":1},{"card":"Beavis and Butthead Do ____.","pick":1},{"card":"I, for one, welcome our new ____ overlords.","pick":1},{"card":"You know, there's a million fine looking women in the world, dude. But they don't all bring you ____ at work. Most of 'em just ____.","pick":2},{"card":"Teenage Mutant Ninja ____.","pick":1},{"card":"Achy Breaky ____.","pick":1},{"card":"I'm not a ____, but I play one on TV.","pick":1},{"card":"An African or European ____?","pick":1},{"card":"Well you can't expect to wield supreme executive power just 'cause some watery tart threw a ____ at you!","pick":1},{"card":"\"____!\" \"It's only a model.\"","pick":1},{"card":"Good night. Sleep well. I'll most likely ____ you in the morning.","pick":1},{"card":"I am The Dread Pirate ____.","pick":1},{"card":"Do you want me to send you back to where you were, ____ in ____?","pick":2},{"card":"I see ____ people.","pick":1},{"card":"____? We don't need no stinking ____!","pick":1},{"card":"I am not fat! I'm just ____.","pick":1},{"card":"Oh my god! They killed ____!","pick":1},{"card":"The anxiously awaited new season of Firefly is rumoured to kick off with an action packed scene, featuring River Tam's amazing feats of ____!","pick":1},{"card":"Two by two, hands of ____.","pick":1},{"card":"Wendy's ____ & Juicy.","pick":1},{"card":"I swear by my pretty floral  ____, I will ____ you.","pick":2},{"card":"At ____, where every day is ____ day!","pick":2},{"card":"I HATE it when ____(s) crawl(s) up my ____!","pick":2},{"card":"____. Like a boss!","pick":1},{"card":"____'s latest music video features a dozen ____ on ____.","pick":3},{"card":"____. It's not just for breakfast anymore.","pick":1},{"card":"In Soviet ____, ____ ____s you.","pick":3},{"card":"____. Part of this nutritious breakfast.","pick":1},{"card":"____. It's what's for dinner!","pick":1},{"card":"Where's the beef?","pick":1},{"card":"____. Breakfast of champions!","pick":1},{"card":"I ____, therefore I ____.","pick":2},{"card":"Welcome to my secret lair. I call it The Fortress of ____.","pick":1},{"card":"My safeword is ____.","pick":1},{"card":"I like ____, but ____ is a hard limit!","pick":2},{"card":"Team ____!","pick":1},{"card":"We went to a workshop on tantric ____.","pick":1},{"card":"Thou shalt not____.","pick":1},{"card":"I am the King of ____!","pick":1},{"card":"The only good ____ is a dead ____.","pick":1},{"card":"A vote for ____ is a vote for ____.","pick":2},{"card":"____ is the new ____.","pick":2},{"card":"Bitches LOVE ____!","pick":1},{"card":"This year's ____ guest of honour is ____.","pick":2},{"card":"This will be the greatest ____con ever!","pick":1},{"card":"____ at last! ____ at last! Thank God almighty, I'm ____ at last! ","pick":1},{"card":"I have a dream that one day this nation will rise up and live out the true meaning of its creed:","pick":1},{"card":"These are my minions of ____!","pick":1},{"card":"____, by Bad Dragon™.","pick":1},{"card":"____ are so goddamn cool.","pick":1},{"card":"Once I started roleplaying ____, it was all downhill from there.","pick":1},{"card":"It's difficult to explain to friends and family why I know so much about ____.","pick":1},{"card":"Who knew I'd be able to make a living off of ____?","pick":1},{"card":"Don't knock ____ until you've tried it.","pick":1},{"card":"Long story short, I ended up with ____ in my ass.","pick":1},{"card":"At first I couldn't understand ____, but now it's my biggest kink.","pick":1},{"card":"____ looks pretty in all the art, but have you seen one in real life?","pick":1},{"card":"My landlord had a lot of uncomfortable questions for me when when he found ____ in my bedroom while I was at work.","pick":1},{"card":"Everyone on this site has such strong opinions about ____.","pick":1},{"card":"I realized they were a furry when they mentioned ____.","pick":1},{"card":"Whoa, I might fantasize about ____, but I'd never actually go that far in real life.","pick":1},{"card":"Realizing, too late, the implications of your interest in ____ as a child.","pick":1},{"card":"I've been into ____ since before I hit puberty, I just didn't know what it meant.","pick":1},{"card":"I'm no longer allowed near ____ after the incident with ____.","pick":2},{"card":"It all started with ____.","pick":1},{"card":"I'll roleplay ____, you can be ____.","pick":2},{"card":"Only my internet friends know that I fantasize about ____.","pick":1},{"card":"Everyone really just goes to the cons for ____.","pick":1},{"card":"My Original Character's name is ____.","pick":1},{"card":"My secret tumblr account where I post nothing but ____.","pick":1},{"card":"The panel I'm looking forward to most at AC this year is...","pick":1},{"card":"If my parents ever found ____, I'd probably be disowned.","pick":1},{"card":"It's really hard not to laugh at ____.","pick":1},{"card":"The most recent item in my search history.","pick":1},{"card":"____ ruined the fandom.","pick":1},{"card":"I didn't believe the rumors about ____, until I saw the videos.","pick":1},{"card":"____. Yeah, that's a pretty interesting way to die.","pick":1},{"card":"After being a furry for so long, I can never see ____ without getting a little aroused.","pick":1},{"card":"I knew I needed to leave the fandom when I realized I was ____.","pick":1},{"card":"Yeah, I know I have a lot of ____ in my favorites, but I'm just here for the art.","pick":1},{"card":"I never felt more accomplished than when I realized I could fit ____ into my ass.","pick":1},{"card":"Okay, ____? Pretty much the cutest thing ever.","pick":1},{"card":"I'm not a \"furry,\" I prefer to be called ____.","pick":1},{"card":"____ is my spirit animal.","pick":1},{"card":"In my past life, I was ____.","pick":1},{"card":"I'm not even sad that I devote at least six hours of each day to ____.","pick":1},{"card":"____. This is what my life has come to.","pick":1},{"card":"Fuck ____, get ____.","pick":2},{"card":"____? Oh murr.","pick":1},{"card":"I would bend over for ____.","pick":1},{"card":"I think having horns would make ____ complicated.","pick":1},{"card":"____? Oh, yeah, I could get my mouth around that.","pick":1},{"card":"What wouldn't I fuck?","pick":1},{"card":"When I thought I couldn't go any lower, I realized I would probably fuck ____.","pick":1},{"card":"I knew my boyfriend was a keeper when he said he'd try ____, just for me.","pick":1},{"card":"I've been waiting all year for ____.","pick":1},{"card":"I can't wait to meet up with my internet friends for ____.","pick":1},{"card":"Did you hear about the guy that smuggled ____ into the hotel?","pick":1},{"card":"I'm not even aroused by normal porn anymore, I can only get off to ____ or ____.","pick":2},{"card":"No, look, you don't understand. I REALLY like ____.","pick":1},{"card":"I don't think my parents will ever accept that the real me is ____.","pick":1},{"card":"I can't believe I spent most of my paycheck on ____.","pick":1},{"card":"You can try to justify ____ all you want, but you don't have to be ____ to realize it's just plain wrong.","pick":2},{"card":"I remember when ____ was just getting started.","pick":1},{"card":"____ are definitely the new huskies.","pick":1},{"card":"The real reason I got into the fandom? ____.","pick":1},{"card":"____ is no substitute for social skills, but it's a start.","pick":1},{"card":"____ is a shining example of what those with autism can really do.","pick":1},{"card":"I don't know how we got on the subject of dragon cocks, but it probably started with ____.","pick":1},{"card":"Actually coming inside ____.","pick":1},{"card":"When no one else is around, sometimes I consider doing things with ____.","pick":1},{"card":"____: Horrible tragedy, or sexual opportunity?","pick":1},{"card":"I'm about 50% ____.","pick":1},{"card":"I knew I had a problem when I had to sell ____ to pay for ____.","pick":2},{"card":"The most pleasant surprise I've had this year.","pick":1},{"card":"It's just that much creepier when 40-year-old men are into ____.","pick":1},{"card":"Jizzing all over ____.","pick":1},{"card":"Hey, you guys wanna come back to my place? I've got ____ and ____.","pick":2},{"card":"It's a little worrying that I have to compare the size of ____ to beverage containers.","pick":1},{"card":"It's not bestiality, it's ____.","pick":1},{"card":"Everyone thinks that because I'm a furry, I'm into ____. Unfortunately, they're right.","pick":1},{"card":"While everyone else seems to have a deep, instinctual fear of ____, it just turns me on.","pick":1},{"card":"Lying about having ____ to get donations, which you spend on ____.","pick":2},{"card":"If you like it, then you should put ____ on it.","pick":1},{"card":"My girlfriend won't let me do ____.","pick":1},{"card":"I'm only gay for ____.","pick":1},{"card":"Excuse you, I'm a were-____.","pick":1},{"card":"My next fursuit will have ____.","pick":1},{"card":"I'm writing a porn comic about ____ and ____. ","pick":2},{"card":"Is it weird that I want to rub my face on ____?","pick":1},{"card":"I never thought I'd be comfortable with ____, but now it's pretty much the only thing I masturbate to.","pick":1},{"card":"Everyone thinks they're so great, but the only thing they're good at drawing is ____.","pick":1},{"card":"They're just going to spend all that money on ____.","pick":1},{"card":"I tell everyone that I make my money off \"illustration,\" when really, I just draw ____.","pick":1},{"card":"Oh, you're an artist? Could you draw ____ for me?","pick":1},{"card":"I used to avoid talking about ____, but now it's just a part of normal conversation with my friends.","pick":1},{"card":"You sometimes wish you'd encounter ____ while all alone, in the woods. With a bottle of lube.","pick":1},{"card":"Most cats are ____.","pick":1},{"card":"Personals ad: Seeking a female who doesn't mind ____, might also be willing to try a male if they're ____.","pick":2},{"card":"Taking pride in one's collection of ____.","pick":1},{"card":"I tell everyone I'm not a furry, but I've drawn a lot of ____.","pick":1},{"card":"My original species combines ____ and ____. It's called ____.","pick":3},{"card":"____. And now I'm bleeding.","pick":1},{"card":"Suck my ____.","pick":1},{"card":"I also take ____ as payment for commissions.","pick":1},{"card":"It is my dream to be covered with ____.","pick":1},{"card":"____ fucking ____. Now that's hot.","pick":2},{"card":"Would you rather suck ____, or get dicked by ____?","pick":2},{"card":"It never fails to liven up the workplace when you ask your coworkers if they'd rather have sex with ____ or ____.","pick":2},{"card":"HELLO FURRIEND, HOWL ARE YOU DOING?","pick":1},{"card":"What are the two worst cards in your hand right now?","pick":2},{"card":"Nobody believes me when I tell that one story about walking in on ____.","pick":1},{"card":"You don't know who ____ is? They're the one that draws ____.","pick":2}],"WHITE_CARDS":["Coat hanger abortions.","Man meat.","Autocannibalism.","Vigorous jazz hands.","Flightless birds.","Pictures of boobs.","Doing the right thing.","Hunting accidents.","A cartoon camel enjoying the smooth, refreshing taste of a cigarette.","The violation of our most basic human rights.","Viagra.","Self-loathing.","Spectacular abs.","An honest cop with nothing left to lose.","Abstinence.","Mountain Dew Code Red.","A balanced breakfast.","Roofies.","Concealing a boner.","Tweeting.","Glenn Beck convulsively vomiting as a brood of crab spiders hatches in his brain and erupts from his tear ducts.","Amputees.","The Big Bang.","Former President George W. Bush.","The Rev. Dr. Martin Luther King, Jr.","Smegma.","Being marginalized.","Cuddling.","Laying an egg.","The Pope.","Aaron Burr.","Genital piercings.","Fingering.","A bleached asshole.","Horse meat.","Fear itself.","Science.","Elderly Japanese men.","Stranger danger.","The terrorists.","Making sex at her.","Praying the gay away.","Same-sex ice dancing.","Ethnic cleansing.","Cheating in the Special Olympics.","German dungeon porn.","Bingeing and purging.","Making a pouty face.","William Shatner.","Heteronormativity.","Nickelback.","Tom Cruise.","The profoundly handicapped.","The placenta.","Chainsaws for hands.","Arnold Schwarzenegger.","An icepick lobotomy.","Goblins.","Object permanence.","Dying.","Foreskin.","A falcon with a cap on its head.","Hormone injections.","Flash flooding.","Flavored condoms.","Dying of dysentery.","Sexy pillow fights.","Stunt doubles.","The invisible hand.","Jew-fros.","A really cool hat.","Sean Penn.","Heartwarming orphans.","Waterboarding.","The clitoris.","The Three-Fifths compromise.","A sad handjob.","Men.","Historically black colleges.","A micropenis.","Raptor attacks.","Agriculture.","A Gypsy curse.","Friends who eat all the snacks.","Vikings.","Pretending to care.","The Underground Railroad.","My humps.","Consultants.","Being a dick to children.","Geese.","A clandestine butt scratch.","Bling.","Sniffing glue.","The South.","An Oedipus complex.","Eating all of the cookies before the AIDS bake-sale.","Heath Ledger.","Sexting.","YOU MUST CONSTRUCT ADDITIONAL PYLONS.","Mutually-assured destruction.","Party poopers.","Sunshine and rainbows.","Muzzy.","Count Chocula.","Sharing needles.","Being rich.","Skeletor.","Chivalry.","A sausage festival.","Michael Jackson.","Uppercuts.","Emotions.","Farting and walking away.","Global warming.","The Chinese gymnastics team.","Necrophilia.","College.","Spontaneous human combustion.","Yeast.","Leaving an awkward voicemail.","Dick Cheney.","White people.","Letting yourself go.","Penis envy.","Stifling a giggle at the mention of Hutus and Tutsis.","Cookie Monster devouring the Eucharist wafers.","Teaching a robot to love.","Sperm whales.","A drive-by shooting.","Scrubbing under the folds.","Panda sex.","Whipping it out.","Will Smith.","Catapults.","Masturbation.","Natural selection.","A LAN party.","Twinkies.","A grande sugar-free iced soy caramel macchiato.","Opposable thumbs.","A sassy black woman.","Soiling oneself.","AIDS.","The KKK.","Figgy pudding.","Seppuku.","Marky Mark and the Funky Bunch.","Gandhi.","Dave Matthews Band.","Preteens.","Toni Morrison's vagina.","Five-Dollar Footlongs™.","Land mines.","A sea of troubles.","A zesty breakfast burrito.","Christopher Walken.","Friction.","Balls.","Dental dams.","A can of whoop-ass.","A tiny horse.","Waiting 'til marriage.","Authentic Mexican cuisine.","Genghis Khan.","Old-people smell.","Feeding Rosie O'Donnell.","Pixelated bukkake.","Re-gifting.","Friends with benefits.","The token minority.","The Tempur-Pedic Swedish Sleep System™.","A thermonuclear detonation.","Take-backsies.","Substitute teachers.","A moment of silence.","The Rapture.","Child abuse.","A cooler full of organs.","That one gay Teletubby.","Sweet, sweet vengeance.","Keeping Christ in Christmas.","RoboCop.","Keanu Reeves.","Drinking alone.","Oversized lollipops.","Garth Brooks.","Giving 110%.","Flesh-eating bacteria.","The American Dream.","Taking off your shirt.","Me time.","A murder most foul.","Nocturnal emissions.","The inevitable heat death of the universe.","The folly of man.","That thing that electrocutes your abs.","Cards Against Humanity.","Fiery poops.","Poor people.","Edible underpants.","Britney Spears at 55.","All-you-can-eat shrimp for $4.99.","Pooping back and forth. Forever.","Fancy Feast.","Jewish fraternities.","Being a motherfucking sorcerer.","Pulling out.","Picking up girls at the abortion clinic.","The homosexual agenda.","The Holy Bible.","Passive-agression.","Ronald Reagan.","Vehicular manslaughter.","Menstruation.","Nipple blades.","Assless chaps.","Full frontal nudity.","Hulk Hogan.","Daddy issues.","The hardworking Mexican.","Natalie Portman.","Waking up half-naked in a Denny's parking lot.","God.","Sean Connery.","Saxophone solos.","Gloryholes.","The World of Warcraft.","Homeless people.","Scalping.","Darth Vader.","Eating the last known bison.","Guys who don't call.","Hot Pockets.","A time travel paradox.","The milk man.","Testicular torsion.","Dropping a chandelier on your enemies and riding the rope up.","World peace.","A salty surprise.","Poorly-timed Holocaust jokes.","Smallpox blankets.","Licking things to claim them as your own.","The heart of a child.","Seduction.","The People's Elbow.","Robert Downey, Jr.","Lockjaw.","A neglected Tamagotchi™.","Eugenics.","A good sniff.","Friendly fire.","Keg stands.","Intelligent design.","The taint; the grundle; the fleshy fun-bridge.","Wearing underwear inside-out to avoid doing laundry.","Hurricane Katrina.","Douchebags on their iPhones.","Free samples.","Jerking off into a pool of children's tears.","A foul mouth.","The glass ceiling.","Republicans.","Explosions.","Michelle Obama's arms.","The deformed.","Getting really high.","Attitude.","Sarah Palin.","Donald Trump.","The Ubermensch.","Pterodactyl eggs.","Altar boys.","My soul.","My sex life.","Raping and pillaging.","Pedophiles.","Forgetting the Alamo.","72 virgins.","Pabst Blue Ribbon.","Domino's™ Oreo™ Dessert Pizza.","Eastern European Turbo-Folk music.","A snapping turtle biting the tip of your penis.","The Blood of Christ.","Half-assed foreplay.","My collection of high-tech sex toys.","A middle-aged man on roller skates.","Bitches.","Bill Nye the Science Guy.","Have some more kugel.","Italians.","Her Royal Highness, Queen Elizabeth II.","A windmill full of corpses.","Adderall™.","Crippling debt.","Shorties and blunts.","A stray pube.","Prancing.","Passing a kidney stone.","A brain tumor.","Leprosy.","Puppies!","Bees?","This answer is postmodern.","Crumpets with the Queen.","Frolicking.","Team-building exercises.","Repression.","Road head.","A bag of magic beans.","An asymmetric boob job.","Dead parents.","Public ridicule.","A mating display.","A mime having a stroke.","Stephen Hawking talking dirty.","African children.","Mouth herpes.","Overcompensation.","Riding off into the sunset.","A vajazzled vagina.","The Thong Song.","Being on fire.","Tangled Slinkys.","Inappropriate yelling.","Civilian casualties.","Auschwitz.","My genitals.","Sobbing into a Hungry-Man Frozen Dinner.","Not reciprocating oral sex.","Lactation.","Being fabulous.","Shaquille O'Neal's acting career.","My relationship status.","Exchanging pleasantries.","Asians who aren't good at math.","Alcoholism.","Incest.","Grave robbing.","Hope.","8 oz. of sweet Mexican black-tar heroin.","Cockfights.","Kim Jong-il.","Kids with ass cancer.","Loose lips.","Winking at old people.","Drum circles.","The Jews.","Bestiality.","(I am doing Kegels right now.)","Justin Bieber.","Doin' it in the butt.","A lifetime of sadness.","The Hamburglar.","Swooping.","Booby-trapping the house to foil burglars.","Classist undertones.","PCP.","New Age music.","American Gladiators.","Not giving a shit about the Third World.","Mr. Snuffleupagus.","The Kool-Aid Man.","A hot mess.","Tentacle porn.","A look-see.","Too much hair gel.","Lumberjack fantasies.","The gays.","Scientology.","Estrogen.","Date rape.","Ring Pops™.","GoGurt.","Judge Judy.","Dick fingers.","Racism.","Glenn Beck being harried by a swarm of buzzards.","Surprise sex!","Police brutality.","Passable transvestites.","The Virginia Tech Massacre.","Tiger Woods.","When you fart and a little bit comes out.","Oompa-Loompas.","A fetus.","Obesity.","Tasteful sideboob.","Hot people.","BATMAN!!!","Black people.","A gassy antelope.","Those times when you get sand in your vagina.","Sexual tension.","Third base.","Racially-biased SAT questions.","Porn stars.","A Super Soaker™ full of cat pee.","Muhammed (Praise Be Unto Him).","Puberty.","A disappointing birthday party.","An erection that lasts longer than four hours.","White privilege.","Getting so angry that you pop a boner.","The forbidden fruit.","Wifely duties.","Two midgets shitting into a bucket.","Queefing.","Wiping her butt.","Golden showers.","Barack Obama.","Nazis.","A robust mongoloid.","An M. Night Shyamalan plot twist.","Getting drunk on mouthwash.","Lunchables™.","Women in yogurt commercials.","John Wilkes Booth.","Powerful thighs.","Mr. Clean, right behind you.","Multiple stab wounds.","Cybernetic enhancements.","Serfdom.","Kanye West.","Women's suffrage.","Children on leashes.","Harry Potter erotica.","The Dance of the Sugar Plum Fairy.","Lance Armstrong's missing testicle.","Dwarf tossing.","Mathletes.","Parting the Red Sea.","Faith healing.","The Amish.","Dead babies.","Child beauty pageants.","Impotence.","AXE Body Spray.","Centaurs.","Copping a feel.","Grandma.","Famine.","The Trail of Tears.","The miracle of childbirth.","Finger painting.","A monkey smoking a cigar.","Goats eating coins.","The Make-A-Wish Foundation.","Anal beads.","The Force.","Kamikaze pilots.","Dry heaving.","Active listening.","Bananas in Pajamas.","Ghosts.","The Hustle.","Peeing a little bit.","A big hoopla about nothing.","Glenn Beck catching his scrotum on a curtain hook.","Another goddamn vampire movie.","Shapeshifters.","The Care Bear Stare.","Hot cheese.","A mopey zoo lion.","A defective condom.","Teenage pregnancy.","A Bop It™.","Expecting a burp and vomiting on the floor.","Horrifying laser hair removal accidents.","Boogers.","Chutzpah.","Unfathomable stupidity.","Breaking out into song and dance.","Soup that is too hot.","Charisma.","Morgan Freeman's voice.","Getting naked and watching Nickelodeon.","MechaHitler.","Flying sex snakes.","The true meaning of Christmas.","My inner demons.","Pac-Man uncontrollably guzzling cum.","My vagina.","The Donald Trump Seal of Approval™.","A homoerotic volleyball montage.","Actually taking candy from a baby.","Jibber-jabber.","Crystal meth.","Exactly what you'd expect.","Natural male enhancement.","Passive-aggressive Post-it notes.","Inappropriate yodeling.","Lady Gaga.","The Little Engine That Could.","Vigilante justice.","A death ray.","Poor life choices.","A gentle caress of the inner thigh.","Customer service representatives.","Embryonic stem cells.","Nicolas Cage.","Firing a rifle into the air while balls deep in a squealing hog.","Switching to Geico.","Euphoria™ by Calvin Klein.","The chronic.","Erectile dysfunction.","\"Tweeting.\"","Home video of Oprah sobbing into a Lean Cuisine.","A bucket of fish heads.","50,000 volts straight to the nipples.","Being fat and stupid.","Hospice care.","A pyramid of severed heads.","Getting married, having a few kids, buying some stuff, retiring to Florida, and dying.","A subscription to Men's Fitness.","Crucifixion.","A micropig wearing a tiny raincoat and booties.","Some god-damn peace and quiet.","Used panties.","A tribe of warrior women.","The penny whistle solo from \"My Heart Will Go On.\"","An oversized lollipop.","Helplessly giggling at the mention of Hutus and Tutsis.","Not wearing pants.","Consensual sex.","Her Majesty, Queen Elizabeth II.","Funky fresh rhymes.","The art of seduction.","The Devil himself.","Advice from a wise, old black man.","Destroying the evidence.","The light of a billion suns.","Wet dreams.","Synergistic management solutions.","Growing a pair.","Silence.","An M16 assault rifle.","Poopy diapers.","A live studio audience.","The Great Depression.","A spastic nerd.","Rush Limbaugh's soft, shitty body.","Tickling Sean Hannity, even after he tells you to stop.","Stalin.","Brown people.","Rehab.","Capturing Newt Gingrich and forcing him to dance in a monkey suit.","Battlefield amputations.","An uppercut.","Shiny objects.","An ugly face.","Menstrual rage.","A bitch slap.","One trillion dollars.","Chunks of dead prostitute.","The entire Mormon Tabernacle Choir.","The female orgasm.","Extremely tight pants.","The Boy Scouts of America.","Stormtroopers.","Throwing a virgin into a volcano.","Getting in her pants, politely.","Gladiatorial combat.","Good grammar.","Hipsters.","Gandalf.","Genetically engineered super-soldiers.","George Clooney's musk.","Getting abducted by Peter Pan.","Eating an albino.","Enormous Scandinavian women.","Fabricating statistics.","Finding a skeleton.","Suicidal thoughts.","Dancing with a broom.","Deflowering the princess.","Dorito breath.","One thousand Slim Jims.","My machete.","Overpowering your father.","Ominous background music.","Media coverage.","Making the penises kiss.","Moral ambiguity.","Medieval Times Dinner & Tournament.","Mad hacky-sack skills.","Just the tip.","Literally eating shit.","Leveling up.","Insatiable bloodlust.","Historical revisionism.","Jean-Claude Van Damme.","Jafar.","The boners of the elderly.","The economy.","Statistically validated stereotypes.","Sudden Poop Explosion Disease.","Slow motion.","Space muffins.","Sexual humiliation.","Sexy Siamese twins.","Santa Claus.","Scrotum tickling.","Ripping into a man's chest and pulling out his still-beating heart.","Ryan Gosling riding in on a white horse.","Quivering jowls.","Revenge fucking.","Pistol-whipping a hostage.","Quiche.","Zeus's sexual appetites.","Words, words, words.","Tripping balls.","Being a busy adult with many important things to do.","The four arms of Vishnu.","The shambling corpse of Larry King.","The hiccups.","The harsh light of day.","The Gulags.","The Fanta girls.","A big black dick.","A beached whale.","A low standard of living.","A nuanced critique.","A bloody pacifier.","A crappy little hand.","Shaft.","Being a dinosaur.","Beating your wives.","Neil Patrick Harris.","Coughing into a vagina.","Carnies.","Nubile slave boys.","Bosnian chicken farmers.","A web of lies.","A rival dojo.","A passionate Latino lover.","Panty raids.","Appreciative snapping.","Apologizing.","Clams.","A woman scorned.","Being awesome at sex.","Spring break!","Another shot of morphine.","Dining with cardboard cutouts of the cast of \"Friends.\"","A soulful rendition of \"Ol' Man River.\"","Making a friend.","A sweaty, panting leather daddy.","Intimacy problems.","The new Radiohead album.","Pretty Pretty Princess Dress-Up Board Game.","A man in yoga pants with a ponytail and feather earrings.","An army of skeletons.","A squadron of moles wearing aviator goggles.","Beefin' over turf.","The Google.","Bullshit.","A sweet spaceship.","A 55-gallon drum of lube.","Special musical guest, Cher.","The human body.","Mild autism.","Nunchuck moves.","Whipping a disobedient slave.","An ether-soaked rag.","Oncoming traffic.","A dollop of sour cream.","A slightly shittier parallel universe.","My first kill.","Boris the Soviet Love Hammer.","The grey nutrient broth that sustains Mitt Romney.","Tiny nipples.","Power.","Death by Steven Seagal.","A Burmese tiger pit.","Basic human decency.","Grandpa's ashes.","One Ring to rule them all.","The day the birds attacked.","Fetal alcohol syndrome.","Graphic violence, adult language, and some sexual content.","A bigger, blacker dick.","The mere concept of Applebee's.","A sad fat dragon with no friends.","A pinata full of scorpions.","Existing.","Hillary Clinton's death stare.","Catastrophic urethral trauma.","Double penetration.","Daddy's belt.","Swiftly achieving orgasm.","Mooing.","Rising from the grave.","Subduing a grizzly bear and making her your wife.","Some really fucked-up shit.","Weapons-grade plutonium.","All of this blood.","Scrotal frostbite.","Taking a man's eyes and balls out and putting his eyes where his balls go and then his balls in the eye holes.","The mixing of the races.","Pumping out a baby every nine months.","Tongue.","Loki, the trickster god.","Whining like a little bitch.","Wearing an octopus for a hat.","An unhinged ferris wheel rolling toward the sea.","Finding Waldo.","Upgrading homeless people to mobile hotspots.","A magic hippie love cloud.","Fuck Mountain.","Living in a trashcan.","The corporations.","Getting hilariously gang-banged by the Blue Man Group.","Jeff Goldblum.","Survivor's guilt.","Me.","All my friends dying.","Shutting the fuck up.","An ass disaster.","Some kind of bird-man.","The entire Internet.","Going around punching people.","A boo-boo.","Indescribable loneliness.","Having sex on top of a pizza.","Chugging a lava lamp.","Warm, velvety muppet sex.","Running naked through a mall, pissing and shitting everywhere.","Nothing.","Samuel L. Jackson.","Self-flagellation.","The systematic destruction of an entire people and their way of life.","The Quesadilla Explosion Salad™ from Chili's.","Reverse cowgirl.","Vietnam flashbacks.","Actually getting shot, for real.","Not having sex.","Cock.","Dying alone and in pain.","A cop who is also a dog.","The way white people is.","Gay aliens.","The primal, ball-slapping sex your parents are having right now.","A cat video so cute that your eyes roll back and your spine slides out of your anus.","A lamprey swimming up the toilet and latching onto your taint.","Slapping a racist old lady.","A black male in his early 20s, last seen wearing a hoodie.","Jumping out at people.","Three months in the hole.","Blood farts.","The Land of Chocolate.","A botched circumcision.","My manservant, Claude.","Vomiting mid-blowjob.","Letting everyone down.","Having shotguns for legs.","Bill Clinton, naked on a bearskin rug with a saxophone.","Mufasa's death scene.","The Harlem Globetrotters.","Demonic possession.","Fisting.","The thin veneer of situational causality that underlies porn.","Girls that always be textin'.","Blowing some dudes in an alley.","A spontaneous conga line.","A vagina that leads to another dimension.","Disco fever.","Getting your dick stuck in a Chinese finger trap with another dick.","Drinking ten 5-hour ENERGYs to get fifty continuous hours of energy.","Sneezing, farting, and coming at the same time.","Some douche with an acoustic guitar.","Spending lots of money.","Putting an entire peanut butter and jelly sandwich into the VCR.","An unstoppable wave of fire ants.","A greased-up Matthew McConaughey.","Flying robots that kill people.","Unlimited soup, salad, and breadsticks.","Crying into the pages of Sylvia Plath.","The moist, demanding chasm of his mouth.","Filling every orifice with butterscotch pudding.","An all-midget production of Shakespeare's [i]Richard III[/i].","Screaming like a maniac.","Not contributing to society in any meaningful way.","A pile of squirming bodies.","Buying the right pants to be cool.","Roland the Farter, flatulist to the king.","That ass.","A surprising amount of hair.","Eating Tom Selleck's mustache to gain his powers.","Velcro™.","A PowerPoint presentation.","Crazy opium eyes.","10 Incredible Facts About the Anus.","An interracial handshake.","Moderate-to-severe joint pain.","Finally finishing off the Indians.","Sugar madness.","Actual mutants with medical conditions and no superpowers.","The secret formula for ultimate female satisfaction.","The complex geopolitical quagmire that is the Middle East.","Fucking a corpse back to life.","Neil Diamond's Greatest Hits.","Calculating every mannerism so as not to suggest homosexuality.","Whatever a McRib is made of.","No clothes on, penis in vagina.","All the single ladies.","Whispering all sexy.","How awesome I am.","Ass to mouth.","Smoking crack, for instance.","Falling into the toilet.","A dance move that's just sex.","The size of my penis.","Some sort of Asian.","A hopeless amount of spiders.","Party Mexicans.","Drinking responsibly.","The safe word.","Angelheaded hipsters burning for the ancient heavenly connection to the starry dynamo in the machinery of night.","Bouncing up and down.","Jizz.","Ambiguous sarcasm.","A shiny rock that proves I love you.","Dem titties.","My worthless son.","Exploding pigeons.","A Ugandan warlord.","My sex dungeon.","A kiss on the lips.","Child Protective Services.","A Native American who solves crimes by going into the spirit world.","Doo-doo.","The peaceful and nonthreatening rise of China.","Sports.","A fart.","Unquestioning obedience.","Three consecutive seconds of happiness.","Grammar nazis who are also regular Nazis.","Snorting coke off a clown's boner.","Africa.","Depression.","A horse with no legs.","The euphoric rush of strangling a drifter.","Khakis.","Interspecies marriage.","A gender identity that can only be conveyed through slam poetry.","Almost giving money to a homeless person.","Stuff a child's face with Fun Dip until he starts having fun.","What Jesus would do.","A for-real lizard that spits blood from its eyes.","Blackula.","The tiniest shred of evidence that God is real.","My dad's dumb fucking face.","Prince Ali,\nfabulous he,\nAli Ababwa.","A manhole.","A sex goblin with a carnival penis.","A bunch of idiots playing a card game instead of interacting like normal humans.","A sex comet from Neptune that plunges the Earth into eternal sexiness.","Sharks with legs.","Injecting speed into one arm and horse tranquilizer into the other.","Lots and lots of abortions.","Badger badger badger badger badger...","Candy Mountain.","Pewdiepie.","Black Mesa.","Linux.","Unix.","My ANUS is bleeding!","My spoon is too big.","Godwin's law.","Nope! Chuck Testa.","Pedo-bear.","Honey badger.","Morgan Freeman.","Inconceivable!!","The Holy Grail.","Camelot.","The machine that goes \"Ping!\"","A herring!","Groovy.","A shrubbery!","The Necronomiconexmortis.","We're coming to get you, Barbara!","My boomstick.","S-Mart.","Good Ash.","Evil Ash.","A REALLY cool cape and tights.","Content.","Pissing in the suit.","Getting caught between Green Lantern creating an anvil and Sinestro creating a hammer.","Getting caught in Spiderman's sticky, sticky... web.","Outrunning The Flash!","The Batmobile!","Being tied up with Wonder Woman's Magic Lasso.","SHAZAM!","The Tick.","Wonder Woman's invisible chopper.","Wood for sheep.","All your base.","An arrow to the knee.","GLaDOS's cake recipe.","Head Crabs.","Gordon Freeman.","The Umbrella Corporation.","A bigger, blacker deck.","The Necronomicon.","Fruit flies.","Fruit bat.","Traumatic insemination.","Bagpipes.","The Metal!","All the ass in the world!","Anti-Matter Chopsticks.","Groinal Exploder.","Shiny!","River Tam.","Browncoats.","Getting raped to death by reavers.","I'll be in my bunk!","The Alliance.","Honey Boo Boo.","Snookie.","Mutton Vindaloo Beast.","Like a boss!","Talkie Toaster.","Queeg 500","Athlete's Hand.","Droid Rot.","Iocane powder.","To the pain.","Damn dirty ape.","The Orgazmorator.","Festively plump.","Cowboys from Hell.","Mecha-Streisand.","Ants in the Pants.","Lice.","Cake.","A gang of bikers.","Soggy biscuit.","Rough trade.","The walk of shame.","A tantrum.","Locusts.","No pants.","Prehensile nipples.","Cultural misappropriation.","Rape culture.","Wal-Mart.","Fifi the dancing poodle.","Cloaca.","Lovingly rendered dragon anus.","Drawing furry porn.","A hermaphrodite snow leopard.","An oversized clitoris that acts as a functional penis.","The texture and color of raw meat.","Applying your obscure, unrealistic fetishes to 90's cartoon characters.","Really, really liking Disney's Robin Hood.","Taking the knot.","Heated debates about human genitalia versus animal genitalia.","Otherkin.","DeviantArt.","Chakats.","Fursecution.","Horses.","Intimacy with the family dog.","A furpile.","The stench of half a dozen unwashed bronies.","Sonic the Hedgehog.","Bowser's sweaty balls.","Krystal, the fox.","StarFox.","Confusing feelings about cartoon characters.","PetSmart.","Babyfurs.","Uncomfortably attractive animals.","Stretching your anus in preparation for horse cock.","A hermaphrodite foxtaur.","Pounced.org.","A large, flared Chance.","Fursuiters at anime conventions.","Embarrassing craigslist ads.","A tub of Vaseline.","An apartment full of internet-obsessed losers.","People who cosplay at furry conventions.","Sex with strangers.","A semen-stained fursuit.","Fursuit adventures.","That one straight guy at the party.","Fake furry girls.","Adoptables with visible genitalia.","My tailhole.","Catching STDs at conventions.","An embarrassingly long F-List profile.","Dragon dildos.","Non-consensual sex with Zaush.","Adam Wan.","Surprise hermaphrodites.","A sassy lioness.","Offensively stereotyped African animals.","Poodles with afros.","A sexually frustrated griffon.","A horny dragon.","Dragoneer.","Discovering that it's never just a big vagina.","That thing that gives your dick a knot IRL.","All this lube.","Endearing social ineptitude.","Realizing that rimming is pretty cool.","That time you let your dog go a little further than just sniffing your crotch.","Drenching your fursuit in Febreeze.","Really, truly heterosexual.","Gay.","Sitting on your face.","Spending more money on commissions than food in a given week.","Shitting on my face.","Barking at strangers.","Anal training.","Discovering monster porn.","A dick so big you have to give it a hugjob.","The fine line between feral and outright bestiality.","Bad Dragon™ cumlube.","Piss.","Leaving your orifices bloody and sore.","Rubbing peanut butter on your genitals.","Forgetting which set of fursuit paws you use for handjobs.","A strategically placed hole.","Smells.","When \"blowing ten bucks\" makes you think of a long night with a bunch of deer.","A lime Citra.","A little bitch.","An autistic knife fight.","Sergals.","About 16 ounces of horse semen.","The noises red pandas make during sex.","Oral knotting.","Dog cum.","Anatomically incorrect genitalia.","Transformation porn.","Belly rubs leading to awkward boners.","When you catch yourself glancing at the crotches of animated characters.","Lifting your tail.","Scritches.","Bad decisions.","Experimenting with fisting.","FUCK YOU, I'M A DRAGON.","Tumbles, the Stair Dragon.","Furry Weekend Atlanta.","Further Confusion.","AnthroCon.","Literally a bucket of semen.","Sexual interest in pretty much anything with a hole.","Attraction to pretty much anything with a penis.","Animal genitalia.","Motherfucking wolves.","Christian furries.","Barbed penises.","Two knots.","A really attractive wolf.","A slutty gay fox.","A surprisingly attractive anteater.","Natascha, the anthro husky.","Nipple buffet.","Tail-sex.","Mary, the anthro mare.","Masturbating, with claws.","Pawing-off.","Furry porn, shamelessly taped to the walls.","Grabby-paws.","Monsters with bedroom eyes.","Accurate avian anatomy.","Impure thoughts about Kobolds.","Erotic roleplay.","Furries in heat.","Fantasizing about sex with just about every monster you encounter in your video game.","Crotch-tits.","The tailstar tango.","Your Character Here.","CrusaderCat.","Jerking off on an unconscious friend's feet.","Puns involving the word \"knot.\"","A prehensile penis.","Cockvore.","A notebook full of embarrassing niche porn sketches.","Being able to recognize your friends by the scent of their asses.","Paws.","Big cute paws.","Bear tits.","The incredibly satisfying sound it makes when you pull it out.","Anal sex you didn't know you wanted.","The premise of every furry comic ever.","Becoming a veterinarian for all the wrong reasons.","Taking special interest in nature documentaries.","A very steampunk rat.","Canine superiority.","Oviposition.","Flares.","Overcompensating with a huge horse penis.","A fedora enthusiast.","A tongue-beast.","Frisky tentacles.","Sex with Pokemon.","Making out with dogs.","YouTube videos of horse breeding.","Pissing on your significant other to show ownership.","Dogs wearing panties.","Monster boys in lingerie.","Power bottoms.","Sheath licking.","Microwaving diapers.","Being \"prison gay.\"","Sexy the Cat.","Adorable dog people.","HELLO FURRIEND, HOWL ARE YOU DOING.","Species stereotypes.","Horns and hooves.","Convention sluts.","Being really, really into monsters.","A spider furry who isn't even into bondage.","No males, no herms, no cuntboys, no shemales, no trannys, no furries, no aliens, no vampires, and no werewolves. ONLY STRAIGHT OR BI HUMAN FEMALES.","Sexual arousal from children's cartoons.","SecondLife.","That one episode of CSI.","Hyper-endowed squirrels.","The Gay Yiffy Club.","Getting feathers stuck in your teeth.","Getting fur stuck in your teeth.","Ignoring a person's faults because their character is hot."]}

  Words =
    action: [
      "helping Kali clean under the folds"
      "filing a class action lawsuit"
      "fucking your sibling"
      "giving a handy"
      "blowing"
      "programming"
      "parsing"
      "sucking two dicks at the same time"
      "taking two dicks in the ass at the same time"
      "marrying your sister"
      "marrying your brother"
      "sitting on dicks"
      "boning your mother"
      "riding your father"
      "obliterating New York"
      "migrating to Canada"
      "tossing the salad"
      "going to prison"
      "wanking to a fashion magazine"
      "fucking your dog"
      "buggering your dog"
      "piledriving that ass"
    ],
    actions: [
      "helping Kali clean under the folds"
      "filing a class action lawsuits"
      "fucking your siblings"
      "giving handies"
      "blowing people"
      "programming"
      "parsing"
      "sucking two dicks at the same time"
      "taking two dicks in the ass at the same time"
      "marrying your sisters"
      "marrying your brothers"
      "sitting on dicks"
      "boning your mothers"
      "riding your fathers"
      "obliterating New York"
      "migrating to Canada"
      "tossing the salad"
      "going to prison"
      "wanking to fashion magazines"
      "having sex with dogs"
      "buggering dogs"
      "piledriving asses"
    ],
    things: [
      "dildos"
      "unicorns"
      "foxes"
      "fennecs"
      "dicks"
      "cocks"
      "dragon dicks"
      "dog dongs"
      "curiously shaped phalli"
      "tri-lipped dog cunts"
      "perfectly-circular and gaping anuses"
      "fox butts"
      "gaping anuses"
      "sex machines"
    ],
    thing: [
      "dildo"
      "unicorn"
      "fox"
      "fennec"
      "dick"
      "cock"
      "dragon dick"
      "dog dong"
      "curiously shaped phallus"
      "tri-lipped dog cunt"
      "fox butt"
      "perfectly-circular and gaping anus"
      "sex machine"
    ]

  Word =
    verb: [
      'fuck'
      'suck'
      'lick'
      'punch'
      'choke'
      'slap'
      'break'
      'wank'
      'fap'
      'stroke'
      'dehumidify'
      'detox'
      'dance'
      'twerk'
      'jiggle'
      'jostle'
      'lunge'
      'faff'
      'spoon'
      'shank'
    ],
    verber: [
      'fucker'
      'sucker'
      'licker'
      'puncher'
      'choker'
      'slapper'
      'breaker'
      'wanker'
      'fapper'
      'stroker'
      'dehumidifier'
      'detoxer'
      'dancer'
      'twerker'
      'jiggler'
      'jostler'
      'lunger'
      'faffer'
      'spooner'
      'shanker'
    ],
    verbing: [
      'fucking'
      'sucking'
      'licking'
      'punching'
      'choking'
      'slapping'
      'breaking'
      'wanking'
      'fapping'
      'stroking'
      'dehumidifying'
      'detoxing'
      'dancing'
      'twerking'
      'jiggling'
      'jostling'
      'lunging'
      'faffing'
      'spooning'
      'shanking'
    ],
    verbed: [
      'fucked'
      'sucked'
      'licked'
      'punched'
      'choked'
      'slapped'
      'broke'
      'wanked'
      'fapped'
      'stroked'
      'dehumidified'
      'detoxed'
      'danced'
      'twerked'
      'jiggled'
      'jostled'
      'lunged'
      'faffed'
      'spooned'
      'shanked'
    ],
    verbs: [
      'fucks'
      'sucks'
      'licks'
      'punches'
      'chokes'
      'slaps'
      'breaks'
      'wanks'
      'faps'
      'strokes'
      'dehumidifies'
      'detoxes'
      'dances'
      'twerks'
      'jiggles'
      'jostles'
      'lunges'
      'faffs'
      'spoons'
      'shanks'
    ],
    noun: [
      'butt'
      'dick'
      'meme'
      'mother'
      'father'
      'brother'
      'sister'
      'friend'
      'mom'
      'dad'
      'cat'
      'dog'
      'companion'
      'dildo'
      'cock'
      'dong'
      'wallet'
      'mitten'
      'car'
      'truck'
      'Nintendo'
      'Wii'
      'xBox'
      'PS4'
      'controller'
      'teacher'
      'mistress'
      'master'
      'ass'
      'booty'
      'prick'
      'sex toy'
    ],
    nouns: [
      'butts'
      'dicks'
      'memes'
      'mothers'
      'fathers'
      'brothers'
      'sisters'
      'friends'
      'moms'
      'dads'
      'cats'
      'dogs'
      'companions'
      'dildos'
      'cocks'
      'dongs'
      'wallets'
      'mittens'
      'cars'
      'trucks'
      'Nintendos'
      'Wiis'
      'xBoxs'
      'PS4s'
      'controllers'
      'teachers'
      'mistresses'
      'masters'
      'asses'
      'booties'
      'pricks'
      'sex toys'
    ],
    adjective: [
      'dank'
      'dark'
      'black'
      'hollow'
      'horny'
      'huge'
      'mammoth'
      'gargantuan'
      'monstrous'
      'grotesque'
      'gangly'
      'lithe'
      'short'
      'tiny'
      'pert'
      'childish'
      'horse-like'
      'whore-like'
      'stinky'
      'stanky'
      'skanky'
      'rank'
      'rude'
      'fat'
      'thick'
      'jiggly'
      'wobbly'
      'timely'
      'wasteful'
      'wanton'
      'dervish'
      'delicate'
    ],
    adverb: [
      'delicately'
      'dervishly'
      'wantonly'
      'wastefully'
      'rudely'
      'childishly'
      'promptly'
      'shortly'
      'grotesquely'
      'monstrously'
      'petitely'
      'quickly'
      'carefully'
      'hornily'
      'hugely'
      'darkly'
      'marvelously'
      'enticingly'
      'sheepishly'
      'sharply'
    ]

  Templates = [
    "[action]? With a [thing]? Wow. Maybe you should have used a [thing]."
    "[action] is not far off from [action]."
    "I can't wait until I'm done [action]! I'm going to go to class and tell my professor I'm ready to start [action]!"
    "You know, considering how popular [things] are, a [thing] is still better at [action]."
    "You think that's weird? Try [action] with your [thing]."
    "Know what I hate? When you pull their pants off their hips and suddenly: [thing]."
    "Kids these days, what with their [things] and [things]... and their [actions]."
    "I can't even turn the corner of the street anymore without running into a [thing] and having to endure [action].",
    "Tonight at 6: How [actions] can get you that [thing] you've always wanted."
    "[action] is a slippery slope that can lead to [things]."
  ]

  return {
    waitFor
    queueTick
    queue
    read
    handle
    whitelist
    Cmds
    Cah
    Stats
    Words
    Word
    Templates
  }