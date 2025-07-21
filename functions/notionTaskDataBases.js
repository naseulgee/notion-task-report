const { Client } = require("@notionhq/client")

export default async function handler(request, response) {
    const payload = await request.json() // 문자열 -> 객체 데이터

    try {
        const notion = new Client({ auth: process.env.NOTION_TASK_REPORT_KEY })
        const res = await notion.search(payload)

        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(error.message, { status: error.status })
    }
}