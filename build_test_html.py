import json

# Define the PENTAD_MAP as it appears in index.js
PENTAD_MAP = {
      "东风解冻": { "name": "东风解冻", "color": "#E0F0E9", "phrase": "立春初候，万物复苏" },
      "蛰虫始振": { "name": "蛰虫始振", "color": "#C0D9D9", "phrase": "立春二候，生机微动" },
      "鱼陟负冰": { "name": "鱼陟负冰", "color": "#A1C6C8", "phrase": "立春三候，阳气转达" },
      "獭祭鱼": { "name": "獭祭鱼", "color": "#B7D1CF", "phrase": "雨水初候，候鸟思归" },
      "候雁北": { "name": "候雁北", "color": "#87BFA2", "phrase": "雨水二候，鸿雁北飞" },
      "草木萌动": { "name": "草木萌动", "color": "#A8D8B9", "phrase": "雨水三候，春意渐浓" },
      "桃始华": { "name": "桃始华", "color": "#FFB7C5", "phrase": "惊蛰初候，桃花始开" },
      "仓庚鸣": { "name": "仓庚鸣", "color": "#FAD0C9", "phrase": "惊蛰二候，黄鹂鸣柳" },
      "鹰化为鸠": { "name": "鹰化为鸠", "color": "#E97692", "phrase": "惊蛰三候，春雷震响" },
      "玄鸟至": { "name": "玄鸟至", "color": "#EF82A0", "phrase": "春分初候，燕子归来" },
      "雷乃发声": { "name": "雷乃发声", "color": "#F3A694", "phrase": "春分二候，雷动九天" },
      "始电": { "name": "始电", "color": "#A1AF9D", "phrase": "春分三候，电光流转" },
      "桐始华": { "name": "桐始华", "color": "#B8D200", "phrase": "清明初候，桐花盛放" },
      "田鼠化为鴽": { "name": "田鼠化为鴽", "color": "#90B44B", "phrase": "清明二候，阴气渐消" },
      "虹始见": { "name": "虹始见", "color": "#6A8372", "phrase": "清明三候，彩虹初现" },
      "萍始生": { "name": "萍始生", "color": "#4F726C", "phrase": "谷雨初候，浮萍生长" },
      "鸣鸠拂其羽": { "name": "鸣鸠拂其羽", "color": "#2E5C5E", "phrase": "谷雨二候，布谷声声" },
      "戴胜降于桑": { "name": "戴胜降于桑", "color": "#1B4332", "phrase": "谷雨三候，桑蚕待吐" },
      "蝼蝈鸣": { "name": "蝼蝈鸣", "color": "#FADAD8", "phrase": "立夏初候，夏虫始鸣" },
      "蚯蚓出": { "name": "蚯蚓出", "color": "#F0A7A0", "phrase": "立夏二候，大地湿润" },
      "王瓜生": { "name": "王瓜生", "color": "#E96D71", "phrase": "立夏三候，蔓藤攀缘" },
      "苦菜秀": { "name": "苦菜秀", "color": "#D8302F", "phrase": "小满初候，苦菜繁茂" },
      "靡草死": { "name": "靡草死", "color": "#C93756", "phrase": "小满二候，喜阴草枯" },
      "麦秋至": { "name": "麦秋至", "color": "#A61B29", "phrase": "小满三候，麦收在望" },
      "螳螂生": { "name": "螳螂生", "color": "#8C1C13", "phrase": "芒种初候，螳螂破茧" },
      "鵙始鸣": { "name": "鵙始鸣", "color": "#F28E1C", "phrase": "芒种二候，伯劳啼鸣" },
      "反舌无声": { "name": "反舌无声", "color": "#EB7A77", "phrase": "芒种三候，百舌静止" },
      "鹿角解": { "name": "鹿角解", "color": "#F2A0A1", "phrase": "夏至初候，阳极阴生" },
      "蜩始鸣": { "name": "蜩始鸣", "color": "#EF928F", "phrase": "夏至二候，蝉鸣深树" },
      "半夏生": { "name": "半夏生", "color": "#C04851", "phrase": "夏至三候，良药而生" },
      "温风至": { "name": "温风至", "color": "#B93A26", "phrase": "小暑初候，热浪袭来" },
      "蟋蟀居壁": { "name": "蟋蟀居壁", "color": "#A7535A", "phrase": "小暑二候，蟋蟀避热" },
      "鹰始挚": { "name": "鹰始挚", "color": "#813C3C", "phrase": "小暑三候，老鹰盘旋" },
      "腐草为萤": { "name": "腐草为萤", "color": "#F47983", "phrase": "大暑初候，萤火微光" },
      "土润溽暑": { "name": "土润溽暑", "color": "#F9906F", "phrase": "大暑二候，湿热蒸腾" },
      "大雨时行": { "name": "大雨时行", "color": "#D25116", "phrase": "大暑三候，骤雨初歇" },
      "凉风至": { "name": "凉风至", "color": "#F8F4ED", "phrase": "立秋初候，暑气渐消" },
      "白露降": { "name": "白露降", "color": "#EEE6D8", "phrase": "立秋二候，晨露初凝" },
      "寒蝉鸣": { "name": "寒蝉鸣", "color": "#DED0B6", "phrase": "立秋三候，秋蝉哀婉" },
      "鹰乃祭鸟": { "name": "鹰乃祭鸟", "color": "#B99C6B", "phrase": "处暑初候，万物收敛" },
      "天地始肃": { "name": "天地始肃", "color": "#8C7042", "phrase": "处暑二候，肃杀之气" },
      "禾乃登": { "name": "禾乃登", "color": "#F9D3E3", "phrase": "处暑三候，五谷丰登" },
      "鸿雁来": { "name": "鸿雁来", "color": "#EACD76", "phrase": "白露初候，雁阵南翔" },
      "玄鸟归": { "name": "玄鸟归", "color": "#D58A46", "phrase": "白露二候，燕子南飞" },
      "群鸟养羞": { "name": "群鸟养羞", "color": "#B47131", "phrase": "白露三候，众鸟储食" },
      "雷始收声": { "name": "雷始收声", "color": "#8A5D2D", "phrase": "秋分初候，惊雷不再" },
      "蛰虫坯户": { "name": "蛰虫坯户", "color": "#6B4E24", "phrase": "秋分二候，虫入地中" },
      "水始涸": { "name": "水始涸", "color": "#F2EADA", "phrase": "秋分三候，降水骤减" },
      "鸿雁来宾": { "name": "鸿雁来宾", "color": "#E9D7C3", "phrase": "寒露初候，宾雁齐至" },
      "雀入大水为蛤": { "name": "雀入大水为蛤", "color": "#D4A373", "phrase": "寒露二候，海市蜃楼" },
      "菊有黄华": { "name": "菊有黄华", "color": "#B08D57", "phrase": "寒露三候，菊花金黄" },
      "豺乃祭兽": { "name": "豺乃祭兽", "color": "#8F7647", "phrase": "霜降初候，豺狼捕食" },
      "草木黄落": { "name": "草木黄落", "color": "#6D5E3B", "phrase": "霜降二候，落叶飘零" },
      "蛰虫咸俯": { "name": "蛰虫咸俯", "color": "#4B4630", "phrase": "霜降三候，昆虫冬眠" },
      "水始冰": { "name": "水始冰", "color": "#344352", "phrase": "立冬初候，凝水成冰" },
      "地始冻": { "name": "地始冻", "color": "#1E2732", "phrase": "立冬二候，土木封冻" },
      "雉入大水为蜃": { "name": "雉入大水为蜃", "color": "#10151D", "phrase": "立冬三候，大蛤隐现" },
      "虹藏不见": { "name": "虹藏不见", "color": "#0A0A0F", "phrase": "小雪初候，彩虹消隐" },
      "天气上升地气下降": { "name": "天气上升地气下降", "color": "#2C3E50", "phrase": "小雪二候，阴阳不交" },
      "闭塞而成冬": { "name": "闭塞而成冬", "color": "#1A1A1A", "phrase": "小雪三候，严冬已至" },
      "鹖鴠不鸣": { "name": "鹖鴠不鸣", "color": "#353535", "phrase": "大雪初候，寒鸟噤声" },
      "虎始交": { "name": "虎始交", "color": "#4A4A4A", "phrase": "大雪二候，猛虎寻偶" },
      "荔挺出": { "name": "荔挺出", "color": "#5F5F5F", "phrase": "大雪三候，马蔺萌发" },
      "蚯蚓结": { "name": "蚯蚓结", "color": "#747474", "phrase": "冬至初候，万象更新" },
      "麋角解": { "name": "麋角解", "color": "#898989", "phrase": "冬至二候，鹿角脱脱" },
      "水泉动": { "name": "水泉动", "color": "#9E9E9E", "phrase": "冬至三候，泉水涌动" },
      "雁北乡": { "name": "雁北乡", "color": "#B3B3B3", "phrase": "小寒初候，大雁北归" },
      "鹊始巢": { "name": "鹊始巢", "color": "#C8C8C8", "phrase": "小寒二候，喜鹊筑巢" },
      "雉始雊": { "name": "雉始雊", "color": "#DDDDDD", "phrase": "小寒三候，山鸡啼鸣" },
      "鸡始乳": { "name": "鸡始乳", "color": "#F2F2F2", "phrase": "大寒初候，幼鸡破壳" },
      "征鸟厉疾": { "name": "征鸟厉疾", "color": "#FFFFFF", "phrase": "大寒二候，猛禽巡猎" },
      "水泽腹坚": { "name": "水泽腹坚", "color": "#E6E1D5", "phrase": "大寒三候，厚冰载途" }
}

with open('index.js', 'r') as f:
    content = f.read()

# Find the html string
import re
match = re.search(r'const html = `([\s\S]+?)`;\n    return new Response', content)
if match:
    html = match.group(1)
    # Replace the placeholder
    html = html.replace('${JSON.stringify(PENTAD_MAP)}', json.dumps(PENTAD_MAP, ensure_ascii=False))
    # Unescape backticks and dollar signs
    html = html.replace('\\`', '`').replace('\\${', '${').replace('\\\\', '\\')
    with open('index.html', 'w') as out:
        out.write(html)
