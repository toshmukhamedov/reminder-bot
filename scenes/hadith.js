import { Scene } from 'grammy-scenes'
import Model from '#config/database'
import inlineKFunction from '../keyboard/inline.js'

const scene = new Scene('Hadith')

scene.do(async (ctx) => {
  if (1151533771 == ctx.message.from.id) {
    ctx.reply('Give me the hadith')
  } else {
    ctx.scene.exit()
  }
})

scene.wait().on('message:text', async (ctx) => {
  ctx.session.hadith = ctx.message.text

  const categories = await Model.Hadith.distinct('category')

  if (categories.length) {
    var buttons = inlineKFunction(
      5,
      ...categories.map((c) => {
        return { view: c, text: c }
      }),
    )
  }

  ctx.reply('Give the category of hadith', { reply_markup: buttons || undefined })

  ctx.scene.resume()
})

scene.wait().on(['message:text', 'callback_query:data'], async (ctx) => {
  const category =
    ctx?.message?.text == 'not' ? undefined : ctx?.message?.text ? ctx.message.text : ctx.update.callback_query.data

  await Model.Hadith.create({
    content: ctx.session.hadith,
    category,
  })

  ctx.reply('Hadith wrote thank you. You are doing your best')

  ctx.scene.exit()
})

export default scene
