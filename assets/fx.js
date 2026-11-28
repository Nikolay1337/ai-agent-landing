/* Живой фон, «завод ИИ-агентов» по блокам страницы и робот-помощник. */
(function(){
  var script = document.currentScript;
  var PAGE = (script && script.getAttribute('data-page')) || 'hub';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var A = '#5ee0a8', C = '#53c8f0', V = '#8b7cf6';
  function isMob(){ return window.innerWidth < 700; }

  /* ---------- Робот (SVG) ---------- */
  var uid = 0;
  function robotSVG(){
    var id = 'rb' + (uid++);
    return '<svg class="rb" viewBox="0 0 120 156" aria-hidden="true" focusable="false">' +
      '<defs>' +
        '<linearGradient id="' + id + 's" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6fbfc"/><stop offset="1" stop-color="#bccbd2"/></linearGradient>' +
        '<linearGradient id="' + id + 'f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bdf7dc"/><stop offset=".45" stop-color="' + C + '" stop-opacity=".85"/><stop offset="1" stop-color="' + C + '" stop-opacity="0"/></linearGradient>' +
        '<radialGradient id="' + id + 'g"><stop offset="0" stop-color="' + A + '" stop-opacity=".5"/><stop offset="1" stop-color="' + A + '" stop-opacity="0"/></radialGradient>' +
      '</defs>' +
      '<circle class="rb-halo" cx="60" cy="74" r="60" fill="url(#' + id + 'g)"/>' +
      '<path class="rb-flame" d="M49 131 Q60 158 71 131 Z" fill="url(#' + id + 'f)"/>' +
      '<rect x="46" y="124" width="28" height="9" rx="4.5" fill="#8ea3ad"/>' +
      '<g class="rb-arm rb-arm-l"><rect x="12" y="88" width="15" height="31" rx="7.5" fill="url(#' + id + 's)"/><circle cx="19.5" cy="122" r="6.5" fill="#8ea3ad"/></g>' +
      '<g class="rb-arm rb-arm-r"><rect x="93" y="88" width="15" height="31" rx="7.5" fill="url(#' + id + 's)"/><circle cx="100.5" cy="122" r="6.5" fill="#8ea3ad"/></g>' +
      '<rect x="27" y="82" width="66" height="45" rx="19" fill="url(#' + id + 's)"/>' +
      '<rect x="44" y="92" width="32" height="21" rx="7.5" fill="#0c151a"/>' +
      '<circle class="rb-core" cx="60" cy="102.5" r="5.5" fill="' + C + '"/>' +
      '<rect x="51" y="75" width="18" height="9" rx="3" fill="#8ea3ad"/>' +
      '<line x1="60" y1="22" x2="60" y2="9" stroke="#8ea3ad" stroke-width="3" stroke-linecap="round"/>' +
      '<circle class="rb-ant" cx="60" cy="7" r="5.5" fill="' + A + '"/>' +
      '<circle cx="18" cy="50" r="7.5" fill="#a9bcc5"/><circle cx="102" cy="50" r="7.5" fill="#a9bcc5"/>' +
      '<rect x="19" y="19" width="82" height="60" rx="25" fill="url(#' + id + 's)"/>' +
      '<rect x="27" y="29" width="66" height="40" rx="18" fill="#0c151a"/>' +
      '<g class="rb-eyes">' +
        '<g class="rb-lids"><rect x="39" y="40" width="14" height="17" rx="7" fill="' + A + '"/><rect x="67" y="40" width="14" height="17" rx="7" fill="' + A + '"/></g>' +
        '<path d="M53 61.5 Q60 66.5 67 61.5" fill="none" stroke="' + A + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '</g>' +
      '<ellipse cx="43" cy="26" rx="13" ry="3.6" fill="#fff" opacity=".6"/>' +
    '</svg>';
  }
  /* контур робота для чертежа и теста (те же пропорции) */
  var OUTLINE =
    '<line x1="60" y1="22" x2="60" y2="9" pathLength="1"/><circle cx="60" cy="7" r="5.5" pathLength="1"/>' +
    '<circle cx="18" cy="50" r="7.5" pathLength="1"/><circle cx="102" cy="50" r="7.5" pathLength="1"/>' +
    '<rect x="19" y="19" width="82" height="60" rx="25" pathLength="1"/><rect x="27" y="29" width="66" height="40" rx="18" pathLength="1"/>' +
    '<rect x="39" y="40" width="14" height="17" rx="7" pathLength="1"/><rect x="67" y="40" width="14" height="17" rx="7" pathLength="1"/>' +
    '<rect x="51" y="75" width="18" height="9" rx="3" pathLength="1"/><rect x="27" y="82" width="66" height="45" rx="19" pathLength="1"/>' +
    '<rect x="44" y="92" width="32" height="21" rx="7.5" pathLength="1"/><circle cx="60" cy="102.5" r="5.5" pathLength="1"/>' +
    '<rect x="12" y="88" width="15" height="31" rx="7.5" pathLength="1"/><rect x="93" y="88" width="15" height="31" rx="7.5" pathLength="1"/>' +
    '<rect x="46" y="124" width="28" height="9" rx="4.5" pathLength="1"/>';

  /* ---------- Сцены «завода» ---------- */
  var SV = '<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">';
  var MONO = 'font-family="ui-monospace,SFMono-Regular,Menlo,monospace"';

  function sceneBlueprint(){
    return SV +
      '<defs><pattern id="fxg1" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="' + C + '" stroke-opacity=".10"/></pattern>' +
      '<pattern id="fxg2" width="200" height="200" patternUnits="userSpaceOnUse"><path d="M200 0H0V200" fill="none" stroke="' + C + '" stroke-opacity=".2"/></pattern></defs>' +
      '<rect width="1600" height="1000" fill="url(#fxg1)"/><rect width="1600" height="1000" fill="url(#fxg2)"/>' +
      '<g transform="translate(1010 175) scale(4.1)" fill="none" stroke="' + C + '" stroke-width=".55" stroke-opacity=".9" class="draw-g">' +
        OUTLINE.replace(/pathLength="1"/g, 'pathLength="1" class="draw"') + '</g>' +
      '<g stroke="' + C + '" stroke-opacity=".6" fill="none" stroke-width="1.2">' +
        '<path d="M1010 880H1502M1010 868V892M1502 868V892"/><path d="M1550 175V815M1538 175H1562M1538 815H1562"/>' +
        '<path d="M1010 175H980M1010 815H980" stroke-dasharray="4 6"/></g>' +
      '<g ' + MONO + ' fill="' + C + '" fill-opacity=".75" font-size="18">' +
        '<text x="1256" y="912" text-anchor="middle">492</text><text x="1572" y="500" transform="rotate(90 1572 500)" text-anchor="middle">640</text>' +
        '<text x="1010" y="140">R-01 · ЧЕРТЁЖ ИИ-АГЕНТА</text></g>' +
      '<g transform="translate(280 760)" fill="none" stroke="' + A + '" stroke-opacity=".55">' +
        '<circle r="150" stroke-dasharray="6 10" class="spin slow"/><circle r="90"/><path d="M-180 0H180M0 -180V180" stroke-opacity=".35"/>' +
        '<path d="M0 0L106 -106" stroke-width="2"/><circle cx="106" cy="-106" r="5" fill="' + A + '"/></g>' +
      '<g stroke="' + C + '" stroke-opacity=".45" fill="none"><rect x="80" y="80" width="300" height="110"/><path d="M80 125H380M230 125V190"/></g>' +
      '<g ' + MONO + ' fill="' + C + '" fill-opacity=".65" font-size="16"><text x="96" y="110">ЗАВОД ИИ-АГЕНТОВ</text><text x="96" y="160">ЛИСТ 1</text><text x="246" y="160">ЭТАП: ЧЕРТЁЖ</text></g>' +
    '</svg>';
  }

  function sceneAssembly(){
    var rollers = '';
    for (var x = 20; x < 1600; x += 80) rollers += '<g transform="translate(' + x + ' 872)"><g class="spin rev"><circle r="15"/><path d="M-15 0H15M0 -15V15"/></g></g>';
    function part(kind, delay){
      var shape = {
        head: '<rect x="-34" y="-50" width="68" height="48" rx="18"/><rect x="-26" y="-42" width="52" height="30" rx="12" fill="' + C + '" fill-opacity=".08"/>',
        body: '<rect x="-30" y="-42" width="60" height="40" rx="16"/><rect x="-12" y="-34" width="24" height="16" rx="5"/>',
        gear: '<circle cy="-28" r="24" stroke-dasharray="7 6" stroke-width="9"/><circle cy="-28" r="9"/>',
        chip: '<rect x="-28" y="-54" width="56" height="52" rx="8"/><text y="-21" text-anchor="middle" font-size="20" ' + MONO + ' fill="' + A + '" stroke="none">AI</text>'
      }[kind];
      return '<g class="part" style="animation-delay:' + delay + 's"><g transform="translate(0 852)">' + shape + '</g></g>';
    }
    function arm(x, cls){
      return '<g transform="translate(' + x + ' 852)" class="' + cls + '">' +
        '<rect x="-56" y="-22" width="112" height="26" rx="7"/>' +
        '<g class="arm1"><rect x="-13" y="-210" width="26" height="196" rx="13"/><circle cy="-20" r="17"/>' +
          '<g transform="translate(0 -205)"><g class="arm2"><rect x="-11" y="-11" width="176" height="22" rx="11"/><circle r="15"/>' +
            '<g transform="translate(166 0)"><path d="M0 0L28 -18M0 0L28 18" stroke-width="5" stroke-linecap="round"/>' +
            '<circle class="spark" cx="34" cy="0" r="5" fill="' + C + '" stroke="none"/></g></g></g></g></g>';
    }
    return SV +
      '<g fill="' + A + '" fill-opacity=".05" stroke="' + A + '" stroke-opacity=".75" stroke-width="2">' +
        arm(460, 'arm-a') + arm(1150, 'arm-b') +
        part('head', 0) + part('body', -4) + part('gear', -8) + part('chip', -12) +
      '</g>' +
      '<g fill="none" stroke="' + C + '" stroke-opacity=".65" stroke-width="2">' +
        '<rect x="-40" y="856" width="1680" height="34" rx="17"/>' +
        '<line x1="-40" y1="856" x2="1640" y2="856" stroke-dasharray="30 20" class="belt" stroke-width="3"/>' + rollers +
      '</g>' +
      '<g fill="none" stroke="' + C + '" stroke-opacity=".6">' +
        '<g class="spin"><circle cx="1390" cy="200" r="74" stroke-width="22" stroke-dasharray="14 12"/><circle cx="1390" cy="200" r="38" stroke-width="2"/><circle cx="1390" cy="200" r="10"/></g>' +
        '<g class="spin rev"><circle cx="1500" cy="300" r="44" stroke-width="16" stroke-dasharray="10 9"/><circle cx="1500" cy="300" r="18" stroke-width="2"/></g>' +
        '<g class="spin rev" style="animation-duration:12s"><circle cx="190" cy="230" r="58" stroke-width="18" stroke-dasharray="12 10"/><circle cx="190" cy="230" r="22" stroke-width="2"/></g>' +
      '</g>' +
      '<text x="80" y="90" ' + MONO + ' font-size="18" fill="' + A + '" fill-opacity=".7">ЦЕХ 2 · СБОРКА</text>' +
    '</svg>';
  }

  function sceneFirmware(){
    var traces = ['M900 380H700V200H380','M900 440H620V520H200','M900 500H760V760H420','M900 560H820V1000',
      'M1200 380H1360V160H1600','M1200 460H1600','M1200 540H1320V780H1560','M960 330V140H760V0','M1080 330V0',
      'M1140 630V860H1380','M1020 630V1000','M900 600H560V900H0'];
    var base = '', pulses = '', vias = '';
    traces.forEach(function(d, i){
      base += '<path d="' + d + '"/>';
      pulses += '<path d="' + d + '" class="pulse" style="animation-delay:' + (-i * 0.7) + 's;animation-duration:' + (3 + (i % 4) * 0.6) + 's"/>';
      var m = d.match(/(-?\d+)(?:[HV](-?\d+))*$/);
      var pts = d.replace(/^M/, '').split(/(?=[HV])/), cx = 0, cy = 0;
      pts.forEach(function(p){
        if (p[0] === 'H') cx = +p.slice(1); else if (p[0] === 'V') cy = +p.slice(1);
        else { var xy = p.split(/\s+/); cx = +xy[0]; cy = +xy[1]; }
      });
      vias += '<circle cx="' + cx + '" cy="' + cy + '" r="7"/>';
    });
    var pins = '';
    for (var k = 0; k < 9; k++){
      var o = 345 + k * 30;
      pins += '<path d="M' + (915 + k * 30 - 15) + ' 330v-22M' + (915 + k * 30 - 15) + ' 630v22M900 ' + o + 'h-22M1200 ' + o + 'h22"/>';
    }
    var code = '', widths = [220, 300, 180, 260, 140, 320, 200, 250, 160];
    widths.forEach(function(w, i){
      code += '<rect class="codeln" x="' + (120 + (i % 3 === 1 ? 30 : 0)) + '" y="' + (330 + i * 34) + '" width="' + w + '" height="12" rx="6" fill="' + (i % 4 === 2 ? A : C) + '" fill-opacity=".45" style="animation-delay:' + (i * 0.25) + 's"/>';
    });
    return SV +
      '<g fill="none" stroke="' + A + '" stroke-opacity=".35" stroke-width="3">' + base + '</g>' +
      '<g fill="none" stroke="' + C + '" stroke-width="4" stroke-linecap="round">' + pulses + '</g>' +
      '<g fill="#0b1014" stroke="' + A + '" stroke-opacity=".7" stroke-width="2">' + vias + '</g>' +
      '<g stroke="' + A + '" stroke-opacity=".7" stroke-width="3" fill="none">' + pins + '</g>' +
      '<rect x="900" y="330" width="300" height="300" rx="26" fill="#0b1014" fill-opacity=".6" stroke="' + A + '" stroke-width="3" stroke-opacity=".85"/>' +
      '<rect x="935" y="365" width="230" height="230" rx="16" fill="none" stroke="' + C + '" stroke-opacity=".5" stroke-width="1.5"/>' +
      '<text x="1050" y="518" text-anchor="middle" font-size="110" font-weight="800" fill="none" stroke="' + A + '" stroke-width="2.5" ' + MONO + '>AI</text>' +
      '<text x="120" y="300" ' + MONO + ' font-size="20" fill="' + A + '" fill-opacity=".75">&gt; прошивка агента…</text>' + code +
      '<rect class="cursor" x="120" y="642" width="14" height="22" fill="' + A + '" fill-opacity=".8"/>' +
      '<text x="80" y="90" ' + MONO + ' font-size="18" fill="' + A + '" fill-opacity=".7">ЦЕХ 3 · ПРОШИВКА</text>' +
    '</svg>';
  }

  function sceneTest(){
    var checks = '';
    ['Связь с API', 'Расчёт метрик', 'Ответ в Telegram', 'Защита данных'].forEach(function(t, i){
      var y = 330 + i * 82;
      checks += '<rect x="160" y="' + y + '" width="36" height="36" rx="9" fill="none" stroke="' + C + '" stroke-opacity=".7" stroke-width="2"/>' +
        '<path class="chk" pathLength="1" d="M169 ' + (y + 19) + 'l7 7 13 -15" fill="none" stroke="' + A + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="animation-delay:' + (i * 0.7) + 's"/>' +
        '<text x="216" y="' + (y + 25) + '" ' + MONO + ' font-size="20" fill="' + C + '" fill-opacity=".75">' + t + '</text>';
    });
    return SV +
      '<defs><linearGradient id="fxscan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + C + '" stop-opacity="0"/><stop offset="1" stop-color="' + C + '" stop-opacity=".45"/></linearGradient></defs>' +
      '<g fill="none" stroke="' + C + '" stroke-opacity=".5">' +
        '<circle cx="1230" cy="480" r="340" stroke-dasharray="4 12" class="spin slow"/><circle cx="1230" cy="480" r="395" stroke-opacity=".25"/>' +
        '<circle cx="1230" cy="480" r="300" class="ring" stroke-width="2"/></g>' +
      '<g transform="translate(985 170) scale(4.1)" fill="' + A + '" fill-opacity=".07" stroke="' + A + '" stroke-opacity=".85" stroke-width=".55">' + OUTLINE + '</g>' +
      '<g class="scan"><rect x="960" y="110" width="540" height="70" fill="url(#fxscan)"/><rect x="960" y="178" width="540" height="3" fill="' + C + '"/></g>' +
      checks +
      '<rect x="985" y="880" width="492" height="14" rx="7" fill="none" stroke="' + C + '" stroke-opacity=".6"/>' +
      '<rect class="prog" x="987" y="882" width="488" height="10" rx="5" fill="' + A + '" fill-opacity=".8"/>' +
      '<text x="985" y="860" ' + MONO + ' font-size="18" fill="' + A + '" fill-opacity=".75">ТЕСТ АГЕНТА · ВСЕ СИСТЕМЫ</text>' +
      '<text x="80" y="90" ' + MONO + ' font-size="18" fill="' + A + '" fill-opacity=".7">ЦЕХ 4 · ТЕСТ</text>' +
    '</svg>';
  }

  function sceneLaunch(){
    var nodes = [[180,520],[330,380],[420,640],[620,300],[760,560],[980,380],[1130,640],[1300,300],[1460,480],[1380,760],[880,820],[520,860]];
    var links = [[0,1],[0,2],[1,3],[2,4],[3,4],[3,5],[4,5],[5,6],[5,7],[6,9],[7,8],[8,9],[4,10],[10,6],[2,11],[11,10]];
    var g = '';
    links.forEach(function(l){ var a = nodes[l[0]], b = nodes[l[1]]; g += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>'; });
    var n = '';
    nodes.forEach(function(p, i){
      n += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i % 3 ? 7 : 11) + '" fill="#0b1014"/>';
      if (i % 3 === 0) n += '<circle class="ring" cx="' + p[0] + '" cy="' + p[1] + '" r="26" fill="none" style="animation-delay:' + (-i * 0.5) + 's"/>';
    });
    var path = 'M60 860 C 380 560, 640 920, 960 560 S 1380 180, 1640 120';
    return SV +
      '<text x="90" y="330" font-size="230" font-weight="800" fill="none" stroke="' + A + '" stroke-opacity=".25" stroke-width="2">24/7</text>' +
      '<g stroke="' + C + '" stroke-opacity=".3" stroke-width="1.5">' + g + '</g>' +
      '<g stroke="' + A + '" stroke-opacity=".75" stroke-width="2">' + n + '</g>' +
      '<path d="' + path + '" fill="none" stroke="' + C + '" stroke-opacity=".55" stroke-width="2" stroke-dasharray="6 12"/>' +
      '<g><path d="M-22 -13 L26 0 L-22 13 L-12 0 Z" fill="' + A + '"/>' +
        (reduce ? '' : '<animateMotion dur="9s" repeatCount="indefinite" rotate="auto" path="' + path + '"/>') + '</g>' +
      '<g class="pop" style="animation-delay:0s"><rect x="1000" y="430" width="220" height="64" rx="18" fill="#0b1014" fill-opacity=".7" stroke="' + A + '" stroke-opacity=".8"/><rect x="1020" y="452" width="150" height="9" rx="4.5" fill="' + A + '" fill-opacity=".6"/><rect x="1020" y="470" width="100" height="9" rx="4.5" fill="' + C + '" fill-opacity=".5"/></g>' +
      '<g class="pop" style="animation-delay:-2s"><rect x="1260" y="170" width="200" height="64" rx="18" fill="#0b1014" fill-opacity=".7" stroke="' + C + '" stroke-opacity=".8"/><rect x="1280" y="192" width="130" height="9" rx="4.5" fill="' + C + '" fill-opacity=".6"/><rect x="1280" y="210" width="90" height="9" rx="4.5" fill="' + A + '" fill-opacity=".5"/></g>' +
      '<g class="pop" style="animation-delay:-4s"><rect x="560" y="640" width="200" height="64" rx="18" fill="#0b1014" fill-opacity=".7" stroke="' + A + '" stroke-opacity=".8"/><rect x="580" y="662" width="140" height="9" rx="4.5" fill="' + A + '" fill-opacity=".6"/><rect x="580" y="680" width="80" height="9" rx="4.5" fill="' + C + '" fill-opacity=".5"/></g>' +
      '<g fill="none" stroke="' + A + '" stroke-opacity=".75" stroke-width="3"><path d="M1140 960H1560M1140 960V760" stroke-opacity=".35" stroke-width="1.5"/>' +
        '<path class="draw" pathLength="1" d="M1150 930L1220 900L1290 915L1360 850L1430 865L1550 770"/></g>' +
      '<text x="80" y="90" ' + MONO + ' font-size="18" fill="' + A + '" fill-opacity=".7">ЗАПУСК · АГЕНТ РАБОТАЕТ</text>' +
    '</svg>';
  }

  var STAGES = ['Чертёж', 'Сборка', 'Прошивка', 'Тест', 'Запуск'];
  var SCENES = [sceneBlueprint, sceneAssembly, sceneFirmware, sceneTest, sceneLaunch];

  /* ---------- Фраза робота по блокам ---------- */
  var SAY = {
    hub: ['Привет! Я ИИ-агент. Выберите, с чего начнём', 'Слева — агент для бизнеса, справа — курс. Нажмите на любой', 'Сначала работаю в бизнесе, потом этому учат на курсе'],
    business: ['Спросите меня про продажи — отвечу за секунды', 'Таблицы оставьте мне, я не устаю', 'Нажмите на вкладку — покажу свой отчёт', 'Подключаюсь только на чтение. Ничего не сломаю', '14 дней бесплатно. Давайте знакомиться!'],
    school: ['Научу поручать мне работу', 'Опыт не нужен — начнём с нуля', 'Нажмите на модуль — там всё по шагам', 'Учитесь, когда удобно. Я на связи 24/7', 'Это мой рабочий кейс. Покажу изнутри', 'Записывайтесь — первый поток уже собирается']
  }[PAGE] || [];
  var FUN = ['Бип-буп! Я на связи 24/7', 'Щекотно!', 'Соберу отчёт быстрее, чем вы допьёте кофе', 'Могу и презентацию, и парсинг', 'Я тут, если что'];

  /* ---------- Сборка слоёв ---------- */
  var fx = document.createElement('div');
  fx.id = 'fx';
  fx.setAttribute('aria-hidden', 'true');
  fx.innerHTML = '<canvas></canvas><div class="scenes">' +
    SCENES.map(function(f, i){ return '<div class="scene" data-i="' + i + '">' + f() + '</div>'; }).join('') +
    '</div><div class="vign"></div>';
  document.body.insertBefore(fx, document.body.firstChild);
  var scenes = [].slice.call(fx.querySelectorAll('.scene'));

  var steps = document.createElement('div');
  steps.id = 'fx-steps';
  steps.setAttribute('aria-hidden', 'true');
  steps.innerHTML = '<div class="ttl">Завод агентов</div>' + STAGES.map(function(s){ return '<div class="st"><i></i><span>' + s + '</span></div>'; }).join('');
  document.body.appendChild(steps);
  var stepEls = [].slice.call(steps.querySelectorAll('.st'));

  /* ---------- Нейросеть на фоне ---------- */
  (function(){
    var cv = fx.querySelector('canvas'), ctx = cv.getContext('2d');
    var W, H, dpr, pts = [], mouse = {x: -999, y: -999}, run = true;
    function init(){
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(isMob() ? 34 : 80, W * H / 16000));
      pts = [];
      for (var i = 0; i < n; i++) pts.push({x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .8});
    }
    function frame(){
      ctx.clearRect(0, 0, W, H);
      var D = isMob() ? 110 : 140;
      for (var i = 0; i < pts.length; i++){
        var p = pts[i];
        if (!reduce){ p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        for (var j = i + 1; j < pts.length; j++){
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < D){ ctx.strokeStyle = 'rgba(83,200,240,' + (1 - d / D) * .22 + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        var mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
        if (md < 180){ ctx.strokeStyle = 'rgba(94,224,168,' + (1 - md / 180) * .45 + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.fillStyle = md < 180 ? 'rgba(154,240,201,.9)' : 'rgba(83,200,240,.55)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      if (run && !reduce) requestAnimationFrame(frame);
    }
    init(); frame();
    window.addEventListener('resize', function(){ init(); if (reduce) frame(); });
    window.addEventListener('pointermove', function(e){ if (e.pointerType === 'mouse'){ mouse.x = e.clientX; mouse.y = e.clientY; } });
    document.addEventListener('visibilitychange', function(){ var was = run; run = !document.hidden; if (run && !was && !reduce) requestAnimationFrame(frame); });
  })();

  /* ---------- Робот-спутник ---------- */
  var bot = document.createElement('div');
  bot.id = 'bot';
  bot.innerHTML = '<div class="rb-tilt"><div class="rb-bubble" role="status" aria-live="polite"></div><button class="rb-btn" type="button" aria-label="Робот-помощник: нажмите, чтобы он что-нибудь сказал">' + robotSVG() + '</button></div>';
  document.body.appendChild(bot);
  var bubble = bot.querySelector('.rb-bubble');

  var heroBot = document.querySelector('.hero-bot');
  var heroBubble = null;
  if (heroBot){
    heroBot.innerHTML = '<div class="orbit"></div>' + robotSVG() + '<div class="rb-bubble">Привет! Я ваш будущий ИИ-агент</div>';
    heroBubble = heroBot.querySelector('.rb-bubble');
    heroBot.setAttribute('role', 'img');
    heroBot.setAttribute('aria-label', 'Анимированный робот машет рукой');
    if (!reduce){
      setTimeout(function(){ heroBot.classList.add('wave'); heroBubble.classList.add('show'); }, 700);
      setTimeout(function(){ heroBot.classList.remove('wave'); }, 3000);
    } else heroBubble.classList.add('show');
    heroBot.addEventListener('click', function(){
      heroBot.classList.remove('wave'); void heroBot.offsetWidth; heroBot.classList.add('wave');
      heroBubble.textContent = FUN[Math.floor(Math.random() * FUN.length)];
      setTimeout(function(){ heroBot.classList.remove('wave'); }, 2000);
    });
  }

  var curX = -200, curY = window.innerHeight * .6, curIdx = -1, sayTimer, said = {};
  function say(text, ms){
    if (!text) return;
    bubble.textContent = text;
    bubble.classList.add('show');
    clearTimeout(sayTimer);
    sayTimer = setTimeout(function(){ bubble.classList.remove('show'); }, ms || (isMob() ? 3600 : 5200));
  }
  function wave(el){ el.classList.remove('wave'); void el.offsetWidth; el.classList.add('wave'); setTimeout(function(){ el.classList.remove('wave'); }, 2000); }

  function place(i, instant){
    var w = bot.offsetWidth, h = bot.offsetHeight || w * 1.3, x, y, left;
    if (isMob()){ x = window.innerWidth - w - 10; y = window.innerHeight - h - 14; left = false; }
    else {
      left = i % 2 === 1;
      var m = Math.max(14, (window.innerWidth - 1160) / 2 - w - 14);
      x = left ? Math.max(m, window.innerWidth >= 1240 ? 58 : 14) : window.innerWidth - w - m;
      y = window.innerHeight * [.58, .42, .64, .5][i % 4] - h / 2;
    }
    var dx = x - curX;
    bot.classList.toggle('left', left);
    if (!instant && !reduce && Math.abs(dx) > 40){
      bot.classList.remove('fly-l', 'fly-r');
      bot.classList.add(dx > 0 ? 'fly-r' : 'fly-l');
      setTimeout(function(){ bot.classList.remove('fly-l', 'fly-r'); }, 1300);
    }
    if (instant){ bot.style.transition = 'none'; }
    bot.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
    if (instant){ void bot.offsetWidth; bot.style.transition = ''; }
    curX = x; curY = y;
  }

  bot.querySelector('.rb-btn').addEventListener('click', function(){
    wave(bot);
    say(FUN[Math.floor(Math.random() * FUN.length)], 3200);
  });
  bot.addEventListener('pointerenter', function(){ bot.classList.add('happy'); });
  bot.addEventListener('pointerleave', function(){ bot.classList.remove('happy'); });

  /* Глаза следят за курсором, моргание, редкие прыжки */
  var robots = function(){ return [].slice.call(document.querySelectorAll('.rb')); };
  window.addEventListener('pointermove', function(e){
    robots().forEach(function(svg){
      var r = svg.getBoundingClientRect(); if (!r.width) return;
      var cx = r.left + r.width / 2, cy = r.top + r.height * .32;
      var ex = Math.max(-6, Math.min(6, (e.clientX - cx) / 45)), ey = Math.max(-4, Math.min(4, (e.clientY - cy) / 60));
      svg.querySelector('.rb-eyes').style.transform = 'translate(' + ex.toFixed(1) + 'px,' + ey.toFixed(1) + 'px)';
    });
  });
  if (!reduce){
    (function blink(){
      setTimeout(function(){
        robots().forEach(function(svg){ var host = svg.parentNode; host.classList.add('blink'); setTimeout(function(){ host.classList.remove('blink'); }, 140); });
        blink();
      }, 2200 + Math.random() * 3600);
    })();
    setInterval(function(){
      if (bot.classList.contains('docked') || document.hidden) return;
      bot.classList.add('hop'); setTimeout(function(){ bot.classList.remove('hop'); }, 750);
    }, 14000);
  }

  /* На телефоне робот бледнеет, пока листают, чтобы не мешать кнопкам */
  var dimT;
  window.addEventListener('scroll', function(){
    if (!isMob()) return;
    bot.classList.add('dim'); bubble.classList.remove('show'); clearTimeout(dimT);
    dimT = setTimeout(function(){ bot.classList.remove('dim'); }, 700);
  }, {passive: true});

  /* ---------- Блоки страницы → этап завода и место робота ---------- */
  var blocks = [].slice.call(document.querySelectorAll('main > *')).filter(function(el){ return el.offsetHeight > 40; });
  function stageOf(i){ return blocks.length < 2 ? 0 : Math.round(i * (STAGES.length - 1) / (blocks.length - 1)); }
  function setActive(i){
    if (i === curIdx) return;
    curIdx = i;
    var s = stageOf(i);
    scenes.forEach(function(sc, k){ sc.classList.toggle('on', k === s); });
    stepEls.forEach(function(el, k){ el.classList.toggle('on', k === s); el.classList.toggle('done', k < s); });
    if (!bot.classList.contains('docked')){
      place(i);
      if (!said[i] && !(isMob() && Object.keys(said).length)){ said[i] = 1; setTimeout(function(){ say(SAY[i]); }, reduce ? 0 : 900); }
      else said[i] = 1;
    }
  }
  function detect(){
    var mid = window.innerHeight * .5, best = 0, bestD = 1e9;
    blocks.forEach(function(b, i){
      var r = b.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid){ best = i; bestD = -1; }
      else if (bestD >= 0){ var d = Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid)); if (d < bestD){ bestD = d; best = i; } }
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) best = blocks.length - 1;
    setActive(best);
  }
  var ticking = false;
  window.addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(function(){ ticking = false; detect(); }); } }, {passive: true});
  window.addEventListener('resize', function(){ place(Math.max(curIdx, 0), true); });

  /* Пока виден большой робот на главной, спутник «спрятан» в нём */
  var heroVisible = heroBot && getComputedStyle(heroBot).display !== 'none' && 'IntersectionObserver' in window;
  function jumpTo(x, y){ bot.style.transition = 'none'; bot.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)'; void bot.offsetWidth; bot.style.transition = ''; curX = x; curY = y; }
  if (heroVisible){
    bot.classList.add('docked');
    new IntersectionObserver(function(es){
      if (es[0].isIntersecting){ bot.classList.add('docked'); bubble.classList.remove('show'); return; }
      if (!bot.classList.contains('docked')) return;
      var r = heroBot.getBoundingClientRect();
      jumpTo(r.left + r.width / 2 - bot.offsetWidth / 2, Math.max(r.top, -bot.offsetHeight));
      bot.classList.remove('docked');
      var i = Math.max(curIdx, 0);
      requestAnimationFrame(function(){ place(i); if (!said[i]){ said[i] = 1; say(SAY[i]); } else say('Я с вами, листайте дальше', 2600); });
    }, {threshold: 0}).observe(heroBot);
  } else {
    jumpTo(window.innerWidth + 60, window.innerHeight * .6);
    setTimeout(function(){ wave(bot); }, 1500);
  }
  detect();
})();
