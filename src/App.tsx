import { useEffect, useMemo, useState } from "react";

type Page = "home" | "studio" | "school" | "challenges" | "looks" | "progress";
type Category = "lips" | "eyes" | "face" | "tools";
type Applied = Record<string, string>;

const palette = {
  lips: ["#A92F4B", "#D96582", "#D99A82", "#7D304F", "#A65F70", "#E46E62", "#693E39", "#572440"],
  eyes: ["#5A3C4F", "#96778B", "#C9A890", "#6E526F", "#A47151", "#453C55", "#7A8A75", "#D8B98B"],
  face: ["#D98787", "#EDB1A8", "#BF777C", "#C99178", "#E5B7A4", "#B77B67", "#E4C5B3", "#966659"],
  tools: ["#42243D", "#C85C83", "#EAE4FA", "#5E9B79"],
};

const productNames: Record<Category, string[]> = {
  lips: ["Lipstick", "Lip gloss", "Lip liner"],
  eyes: ["Eyeshadow", "Eyeliner", "Mascara", "Brow color"],
  face: ["Blush", "Foundation", "Highlighter", "Contour"],
  tools: ["Brush", "Eraser", "Blend", "Clear area"],
};

const models = [
  { name: "Amara", skin: "#6D4436", hair: "#241A19", top: "#E4C5D4" },
  { name: "Sofia", skin: "#D7A07E", hair: "#5B3426", top: "#B9A9DD" },
  { name: "Mei", skin: "#EDC2A1", hair: "#211D20", top: "#D8839E" },
  { name: "Nia", skin: "#925F49", hair: "#191518", top: "#D9B77B" },
  { name: "Freya", skin: "#F1C9B5", hair: "#C69263", top: "#9B7898" },
  { name: "Priya", skin: "#B97758", hair: "#292023", top: "#C9697F" },
];

const tutorials = [
  { title: "Everyday Natural Makeup", level: "Beginner", time: "8 min", steps: 5, reward: 40, colors: ["#E7B59D", "#A87962"] },
  { title: "Soft Pink Makeup", level: "Beginner", time: "10 min", steps: 5, reward: 45, colors: ["#F2B6C7", "#B95E7D"] },
  { title: "Classic Red Lip", level: "Beginner", time: "6 min", steps: 4, reward: 35, colors: ["#C33D51", "#7B2236"] },
  { title: "Smokey Eyes", level: "Intermediate", time: "14 min", steps: 7, reward: 70, colors: ["#5E505B", "#211D25"] },
  { title: "Party Glam", level: "Advanced", time: "18 min", steps: 8, reward: 100, colors: ["#8A4D70", "#D6AE72"] },
  { title: "Bridal Makeup Basics", level: "Intermediate", time: "16 min", steps: 7, reward: 85, colors: ["#E8BFB5", "#BC8D82"] },
  { title: "Korean-Inspired Makeup", level: "Intermediate", time: "12 min", steps: 6, reward: 65, colors: ["#F09FAE", "#D75E72"] },
  { title: "Beginner Blush Technique", level: "Beginner", time: "5 min", steps: 3, reward: 30, colors: ["#E79891", "#C76B72"] },
];

const challenges = [
  { title: "Soft Pink Muse", desc: "Create a luminous monochrome pink look.", reward: 80, difficulty: "Easy", colors: ["#EAA5BB", "#B95175", "#F5CED9"] },
  { title: "The Red Lip Edit", desc: "Make a confident classic lip the focus.", reward: 65, difficulty: "Easy", colors: ["#B92C43", "#6F2030", "#E6B39C"] },
  { title: "Sunset Eyes", desc: "Blend warm coral, gold, and plum tones.", reward: 110, difficulty: "Medium", colors: ["#E18462", "#E0AF62", "#713F61"] },
  { title: "Purple After Dark", desc: "Build an editorial lavender glam look.", reward: 140, difficulty: "Hard", colors: ["#6C437B", "#A87BB6", "#DABCE2"] },
];

const tutorialSteps = [
  { area: "face", product: "Foundation", text: "Apply a light, natural foundation base." },
  { area: "face", product: "Blush", text: "Add a soft pink blush to both cheeks." },
  { area: "eyes", product: "Eyeshadow", text: "Sweep a neutral shade over the eyelids." },
  { area: "eyes", product: "Mascara", text: "Define the lashes with a light coat." },
  { area: "lips", product: "Lipstick", text: "Finish with a sheer nude lipstick." },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    sparkle: <><path d="M12 2l1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4L12 2Z"/><path d="M5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z"/></>,
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,
    brush: <><path d="m14 4 6 6"/><path d="M17 3 8 12l4 4 9-9c1-2-2-5-4-4Z"/><path d="M8 12c-4 0-5 3-5 7 3-2 6 0 9-3"/></>,
    book: <><path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4Z"/><path d="M7 16h11M8 8h6"/></>,
    trophy: <><path d="M8 4h8v4a4 4 0 0 1-8 0V4ZM10 12v4M14 12v4M8 20h8M10 16h4"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m5 18 5-5 3 3 2-2 4 4"/></>,
    undo: <><path d="M9 7 4 12l5 5"/><path d="M5 12h8a6 6 0 0 1 6 6"/></>,
    redo: <><path d="m15 7 5 5-5 5"/><path d="M19 12h-8a6 6 0 0 0-6 6"/></>,
    reset: <><path d="M20 7v5h-5"/><path d="M19 12a8 8 0 1 0-2 5"/></>,
    save: <><path d="M5 3h12l3 3v15H4V3Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/></>,
    back: <><path d="m15 18-6-6 6-6"/><path d="M9 12h11"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>,
    heart: <path d="M20 8c0 6-8 11-8 11S4 14 4 8c0-5 6-6 8-2 2-4 8-3 8 2Z"/>,
    trash: <><path d="M4 7h16M9 3h6l1 4H8l1-4ZM7 7l1 14h8l1-14"/></>,
    download: <><path d="M12 3v12m0 0 5-5m-5 5-5-5"/><path d="M5 20h14"/></>,
    minus: <path d="M5 12h14"/>,
    plus: <><path d="M5 12h14M12 5v14"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    play: <path d="m9 7 8 5-8 5V7Z"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="logo"><span className="logo-mark"><Icon name="sparkle" size={20}/></span>{!compact && <span>GlowPlay <b>Studio</b></span>}</div>;
}

function Button({ children, variant = "primary", icon, onClick, disabled, className = "" }: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "dark"; icon?: string; onClick?: () => void; disabled?: boolean; className?: string }) {
  return <button className={`button ${variant} ${className}`} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon}/>}<span>{children}</span></button>;
}

function ModelFace({ model, applied = {}, compact = false, activeArea = "", onApply }: { model: typeof models[number]; applied?: Applied; compact?: boolean; activeArea?: string; onApply?: (area: string) => void }) {
  return <svg className={`model-face ${compact ? "compact" : ""}`} viewBox="0 0 400 500" role="img" aria-label={`${model.name} makeup model`}>
    <defs>
      <linearGradient id={`skin-${model.name}`} x1="0" x2="1"><stop stopColor={model.skin}/><stop offset=".52" stopColor={model.skin}/><stop offset="1" stopColor="#fff" stopOpacity=".12"/></linearGradient>
      <linearGradient id={`bg-${model.name}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={model.top}/><stop offset="1" stopColor="#FFF9F5"/></linearGradient>
    </defs>
    <rect width="400" height="500" rx="34" fill={`url(#bg-${model.name})`} opacity=".34"/>
    <path d="M88 193C70 81 132 30 201 30c92 0 137 68 116 183l-25 142H105L88 193Z" fill={model.hair}/>
    <path d="M137 347c-4 37-28 52-67 64-25 8-42 27-49 89h358c-7-62-24-81-49-89-39-12-63-27-67-64H137Z" fill={model.top}/>
    <path d="M145 318h110v73c-28 24-82 23-110 0v-73Z" fill={model.skin}/>
    <path d="M109 160c6-73 43-105 91-105s85 32 91 105l-13 122c-8 67-43 94-78 94s-70-27-78-94l-13-122Z" fill={`url(#skin-${model.name})`} stroke="#34252d" strokeOpacity=".12"/>
    <ellipse cx="113" cy="233" rx="14" ry="26" fill={model.skin}/><ellipse cx="287" cy="233" rx="14" ry="26" fill={model.skin}/>
    {applied.Foundation && <path d="M119 167c8-66 41-96 81-96s73 30 81 96l-12 111c-7 58-37 82-69 82s-62-24-69-82l-12-111Z" fill={applied.Foundation} opacity=".22"/>}
    <g onClick={() => onApply?.("eyes")} className={onApply ? "face-region" : ""}>
      <path d="M137 205q28-25 52 1-28 12-52-1ZM211 206q25-26 52-1-25 13-52 1Z" fill={applied.Eyeshadow || "transparent"} opacity={applied.Eyeshadow ? ".72" : "1"}/>
      <path d="M137 207q27 12 52-1M211 207q26 12 52-1" stroke={applied.Eyeliner || "#33252D"} strokeWidth={applied.Eyeliner ? 5 : 2.5} fill="none"/>
      <ellipse cx="164" cy="207" rx="4.5" ry="5.5" fill="#30252E"/><ellipse cx="237" cy="207" rx="4.5" ry="5.5" fill="#30252E"/>
      <path d="M138 185q25-15 50 0M212 185q25-15 50 0" fill="none" stroke={applied["Brow color"] || model.hair} strokeWidth="6" strokeLinecap="round"/>
      {activeArea === "eyes" && <><ellipse cx="164" cy="205" rx="43" ry="31" fill="none" stroke="#C85C83" strokeWidth="3" strokeDasharray="7 7"/><ellipse cx="237" cy="205" rx="43" ry="31" fill="none" stroke="#C85C83" strokeWidth="3" strokeDasharray="7 7"/></>}
    </g>
    <path d="M197 210c-2 23-8 48-13 59 8 7 18 8 27 1" fill="none" stroke="#5D3D3A" strokeOpacity=".35" strokeWidth="2"/>
    <g onClick={() => onApply?.("face")} className={onApply ? "face-region" : ""}>
      {applied.Blush && <><ellipse cx="143" cy="267" rx="35" ry="20" fill={applied.Blush} opacity=".36"/><ellipse cx="258" cy="267" rx="35" ry="20" fill={applied.Blush} opacity=".36"/></>}
      {applied.Highlighter && <><path d="m139 246 25-5" stroke={applied.Highlighter} strokeWidth="9" strokeLinecap="round" opacity=".38"/><path d="m237 241 25 5" stroke={applied.Highlighter} strokeWidth="9" strokeLinecap="round" opacity=".38"/></>}
      {activeArea === "face" && <><ellipse cx="143" cy="266" rx="42" ry="29" fill="none" stroke="#C85C83" strokeWidth="3" strokeDasharray="7 7"/><ellipse cx="258" cy="266" rx="42" ry="29" fill="none" stroke="#C85C83" strokeWidth="3" strokeDasharray="7 7"/></>}
    </g>
    <g onClick={() => onApply?.("lips")} className={onApply ? "face-region" : ""}>
      <path d="M164 306q17-17 36-3 18-14 36 3-13 34-36 34-24 0-36-34Z" fill={applied.Lipstick || "#9B5A5D"} opacity={applied.Lipstick ? ".92" : ".58"} stroke={applied["Lip liner"] || "transparent"} strokeWidth="3"/>
      <path d="M169 308q31 10 62 0" fill="none" stroke="#572F39" strokeOpacity=".55"/>
      {applied["Lip gloss"] && <path d="M178 315q20 8 42 0" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".45"/>}
      {activeArea === "lips" && <ellipse cx="200" cy="316" rx="48" ry="35" fill="none" stroke="#C85C83" strokeWidth="3" strokeDasharray="7 7"/>}
    </g>
  </svg>;
}

function Header({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const nav: [Page, string][] = [["studio", "Play Studio"], ["school", "Makeup School"], ["challenges", "Challenges"], ["looks", "My Looks"]];
  return <header className="site-header"><button className="brand-button" onClick={() => setPage("home")}><Logo/></button><nav>{nav.map(([id, label]) => <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)}>{label}</button>)}</nav><button className="profile" onClick={() => setPage("progress")} aria-label="Open progress"><span>4</span>GP</button></header>;
}

function Home({ setPage }: { setPage: (p: Page) => void }) {
  return <><Header page="home" setPage={setPage}/><main className="home">
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><Icon name="sparkle" size={15}/> Your beauty, your canvas</div><h1>Your Face. Your Colors.<br/><em>Your Creativity.</em></h1><p>Play with makeup, discover your style, and learn one look at a time.</p><div className="hero-actions"><Button icon="brush" onClick={() => setPage("studio")}>Start Playing</Button><Button variant="secondary" icon="book" onClick={() => setPage("school")}>Explore Tutorials</Button></div><div className="social-proof"><div className="mini-faces">{models.slice(0,4).map(m => <span key={m.name} style={{background:m.skin}}/> )}</div><span><b>12,000+</b> looks created this week</span></div></div>
      <div className="hero-preview"><div className="preview-top"><span><i/> Free Play Studio</span><span className="live-badge">LIVE CANVAS</span></div><div className="preview-body"><div className="preview-tools">{["brush","sparkle","heart"].map(i=><span key={i}><Icon name={i}/></span>)}</div><ModelFace model={models[1]} applied={{Blush:"#D96582", Eyeshadow:"#96778B", Lipstick:"#A92F4B"}}/><div className="floating-palette"><small>LIP COLOR</small><div>{palette.lips.slice(0,5).map(c=><i key={c} style={{background:c}}/>)}</div></div></div></div>
    </section>
    <section className="section modes"><div className="section-heading"><div><span className="kicker">CHOOSE YOUR WAY TO GLOW</span><h2>What will you create today?</h2></div><p>From free-form artistry to step-by-step lessons, there’s a mode for every mood.</p></div><div className="mode-grid">
      {[["brush","Free Makeup Play","Your face, your rules. Explore every shade and tool.","studio"],["book","Makeup School","Learn techniques through guided, bite-sized lessons.","school"],["trophy","Daily Challenges","Put your creativity to the test and earn stars.","challenges"],["sparkle","Create Your Own Look","Start with a fresh face and make it entirely yours.","studio"]].map(([icon,title,text,to],i)=><button className={`mode-card card-${i+1}`} key={title} onClick={()=>setPage(to as Page)}><span className="mode-icon"><Icon name={icon}/></span><span className="mode-number">0{i+1}</span><h3>{title}</h3><p>{text}</p><span className="text-link">Explore mode <Icon name="chevron" size={15}/></span></button>)}
    </div></section>
    <section className="section journey"><div className="journey-copy"><span className="kicker">YOUR BEAUTY JOURNEY</span><h2>Play. Learn. Glow.</h2><p>Every look you create builds your skills. Collect stars, unlock achievements, and find your signature style.</p><Button variant="dark" onClick={()=>setPage("progress")}>View my progress</Button></div><div className="level-card"><div className="level-top"><span className="level-medal"><Icon name="star" size={26}/></span><div><small>CURRENT LEVEL</small><h3>Color Explorer</h3></div><strong>2</strong></div><div className="progress-label"><span>640 / 1,000 stars</span><span>64%</span></div><div className="progress"><i style={{width:"64%"}}/></div><div className="stats"><span><b>640</b> Total stars</span><span><b>4</b> Lessons</span><span><b>7</b> Looks</span></div></div></section>
  </main><Footer setPage={setPage}/></>;
}

function Studio({ setPage, tutorial = false, challenge = "", onSave }: { setPage: (p: Page)=>void; tutorial?: boolean; challenge?: string; onSave: (model:number, applied:Applied)=>void }) {
  const [model, setModel] = useState(1);
  const [category, setCategory] = useState<Category>(tutorial ? "face" : "lips");
  const [product, setProduct] = useState(tutorial ? "Foundation" : "Lipstick");
  const [shade, setShade] = useState(palette[category][0]);
  const [size, setSize] = useState(42);
  const [opacity, setOpacity] = useState(78);
  const [history, setHistory] = useState<Applied[]>([{}]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [before, setBefore] = useState(false);
  const [step, setStep] = useState(0);
  const [saveOpen, setSaveOpen] = useState(false);
  const [complete, setComplete] = useState(false);
  const applied = history[historyIndex];
  const activeArea = tutorial ? tutorialSteps[step]?.area : "";

  useEffect(() => {
    if (tutorial && tutorialSteps[step]) {
      const s = tutorialSteps[step];
      setCategory(s.area as Category);
      setProduct(s.product);
    }
  }, [step, tutorial]);

  const apply = (area?: string) => {
    if (before) return;
    const target = product === "Brush" ? (area === "lips" ? "Lipstick" : area === "eyes" ? "Eyeshadow" : "Blush") : product;
    if (["Eraser","Clear area"].includes(target)) {
      const next = {...applied};
      const keys = area === "lips" ? ["Lipstick","Lip gloss","Lip liner"] : area === "eyes" ? ["Eyeshadow","Eyeliner","Mascara","Brow color"] : ["Blush","Foundation","Highlighter","Contour"];
      keys.forEach(k => delete next[k]);
      push(next); return;
    }
    if (target === "Blend") return;
    push({...applied, [target]: shade});
  };
  const push = (next: Applied) => { const h = history.slice(0, historyIndex + 1); setHistory([...h, next]); setHistoryIndex(h.length); };
  const reset = () => { if (Object.keys(applied).length && window.confirm("Clear all makeup from this look?")) push({}); };
  const chooseCategory = (c:Category) => { setCategory(c); setProduct(productNames[c][0]); setShade(palette[c][0]); };
  const save = () => { onSave(model, applied); setSaveOpen(false); };

  if (complete) return <Completion challenge={challenge} onReplay={()=>{setComplete(false);setStep(0);push({});}} onSave={()=>setSaveOpen(true)} onOther={()=>setPage(challenge ? "challenges":"school")} model={models[model]} applied={applied}/>;
  return <div className="studio">
    <header className="studio-header"><button className="icon-button back" onClick={()=>setPage(tutorial?"school":challenge?"challenges":"home")} aria-label="Exit studio"><Icon name="back"/></button><Logo/><div className="look-meta"><span>{tutorial ? "GUIDED LESSON" : challenge ? "CHALLENGE MODE":"FREE PLAY"}</span><b>{tutorial ? "Everyday Natural" : challenge || "Untitled glow"}</b></div><div className="header-actions"><button className="icon-button" onClick={()=>setHistoryIndex(Math.max(0,historyIndex-1))} disabled={!historyIndex} aria-label="Undo"><Icon name="undo"/></button><button className="icon-button" onClick={()=>setHistoryIndex(Math.min(history.length-1,historyIndex+1))} disabled={historyIndex===history.length-1} aria-label="Redo"><Icon name="redo"/></button><Button variant="ghost" icon="reset" onClick={reset}>Reset</Button><Button icon="save" onClick={()=>setSaveOpen(true)}>Save Look</Button></div></header>
    <div className="studio-workspace">
      <aside className="model-panel panel"><div className="panel-title"><div><span className="kicker">MODEL LIBRARY</span><h2>Choose your muse</h2></div><button className="mini-filter">All</button></div><div className="model-tabs"><button className="active">Natural</button><button>Glam</button><button>Editorial</button></div><div className="model-grid">{models.map((m,i)=><button key={m.name} className={`model-thumb ${model===i?"active":""}`} onClick={()=>setModel(i)}><ModelFace model={m} compact/><span>{m.name}</span>{model===i&&<i><Icon name="check" size={12}/></i>}</button>)}</div><div className="model-tip"><Icon name="sparkle"/><span><b>Pro tip</b>Try the same look on different skin tones.</span></div></aside>
      <main className="canvas-area">
        <div className="canvas-top"><div className="before-toggle"><button className={!before?"active":""} onClick={()=>setBefore(false)}>After</button><button className={before?"active":""} onClick={()=>setBefore(true)}>Before</button></div><div className="zoom"><button><Icon name="minus"/></button><span>100%</span><button><Icon name="plus"/></button></div></div>
        {tutorial && <div className="tutorial-card"><span className="step-pill">STEP {step+1} OF {tutorialSteps.length}</span><div><b>{tutorialSteps[step].product}</b><p>{tutorialSteps[step].text}</p></div><button aria-label="Hide instruction"><Icon name="close" size={16}/></button></div>}
        {challenge && <div className="challenge-brief"><Icon name="trophy"/><span><b>{challenge}</b> Complete three makeup areas to earn 80 stars</span></div>}
        <div className="canvas"><div className="canvas-glow"/><ModelFace model={models[model]} applied={before?{}:applied} activeArea={activeArea} onApply={apply}/><span className="canvas-caption"><i/> Click a face area to apply {product.toLowerCase()}</span></div>
        {tutorial && <div className="step-controls"><Button variant="ghost" onClick={()=>setStep(Math.max(0,step-1))} disabled={!step}>Previous</Button><button className="skip" onClick={()=>step===tutorialSteps.length-1?setComplete(true):setStep(step+1)}>Skip step</button><Button onClick={()=>{apply(tutorialSteps[step].area);step===tutorialSteps.length-1?setComplete(true):setStep(step+1)}}>{step===tutorialSteps.length-1?"Complete lesson":"Apply & next"}</Button></div>}
      </main>
      <aside className="kit-panel panel"><div className="kit-heading"><span className="kicker">YOUR MAKEUP KIT</span><h2>Create your look</h2></div><div className="category-tabs">{(["lips","eyes","face","tools"] as Category[]).map(c=><button key={c} className={category===c?"active":""} onClick={()=>chooseCategory(c)}>{c}</button>)}</div><div className="product-list">{productNames[category].map((p,i)=><button key={p} className={product===p?"active":""} onClick={()=>setProduct(p)}><span className={`product-icon product-${category}-${i}`}><Icon name={category==="tools"?"brush":"sparkle"} size={18}/></span><span>{p}</span>{product===p&&<Icon name="check" size={15}/>}</button>)}</div><div className="shade-section"><div className="control-label"><span>Choose a shade</span><button>View all</button></div><div className="swatches">{palette[category].map((c,i)=><button key={c} aria-label={`Shade ${i+1}`} className={shade===c?"active":""} style={{background:c}} onClick={()=>setShade(c)}>{shade===c&&<Icon name="check" size={16}/>}</button>)}</div><div className="selected-color"><i style={{background:shade}}/><span><small>SELECTED SHADE</small><b>{category==="lips"?"Rose Atelier":"Soft Petal"}</b></span><code>{shade}</code></div></div><div className="slider-control"><div className="control-label"><span>Brush size</span><b>{size}px</b></div><input aria-label="Brush size" type="range" min="10" max="90" value={size} onChange={e=>setSize(+e.target.value)}/></div><div className="slider-control"><div className="control-label"><span>Intensity</span><b>{opacity}%</b></div><input aria-label="Intensity" type="range" value={opacity} onChange={e=>setOpacity(+e.target.value)}/></div><button className="reset-tool" onClick={()=>setProduct(productNames[category][0])}><Icon name="reset" size={15}/>Reset tool settings</button></aside>
    </div>
    <div className="bottom-toolbar"><button onClick={()=>setHistoryIndex(Math.max(0,historyIndex-1))} disabled={!historyIndex}><Icon name="undo"/><span>Undo</span></button><button onClick={()=>setHistoryIndex(Math.min(history.length-1,historyIndex+1))} disabled={historyIndex===history.length-1}><Icon name="redo"/><span>Redo</span></button><button onClick={reset}><Icon name="trash"/><span>Clear makeup</span></button><button onClick={()=>setBefore(!before)}><Icon name="image"/><span>{before?"Show after":"Before / after"}</span></button>{challenge && <Button onClick={()=>setComplete(true)}>Finish challenge</Button>}<Button icon="save" className="save-bottom" onClick={()=>setSaveOpen(true)}>Save My Look</Button></div>
    {saveOpen&&<SaveModal onClose={()=>setSaveOpen(false)} onSave={save} model={models[model]} applied={applied}/>}
  </div>;
}

function SaveModal({onClose,onSave,model,applied}:{onClose:()=>void;onSave:()=>void;model:typeof models[number];applied:Applied}) {
  const [name,setName]=useState("Rosewater glow");
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={onClose}><Icon name="close"/></button><div className="modal-preview"><ModelFace model={model} applied={applied}/></div><div className="modal-content"><span className="kicker">A NEW MASTERPIECE</span><h2>Save your look</h2><p>Give your creation a name so you can find it in your gallery.</p><label>Look name<input value={name} onChange={e=>setName(e.target.value)} autoFocus/></label><label className="favorite-check"><input type="checkbox"/> Add to favorites</label><div className="modal-actions"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button icon="save" onClick={onSave}>Save to My Looks</Button></div></div></div></div>;
}

function School({setPage,startTutorial}:{setPage:(p:Page)=>void;startTutorial:()=>void}) {
  return <><Header page="school" setPage={setPage}/><main className="inner-page"><PageIntro kicker="MAKEUP SCHOOL" title="Learn the art of makeup," italic="one look at a time." text="Friendly, guided lessons designed to build your confidence and creativity."/><div className="featured-lesson"><div className="feature-art"><ModelFace model={models[2]} applied={{Blush:"#D96582",Eyeshadow:"#C9A890",Lipstick:"#D99A82"}}/></div><div className="feature-copy"><span className="pill">FEATURED · BEGINNER</span><h2>Everyday Natural Makeup</h2><p>Master a fresh, effortless look with five essential techniques you’ll use again and again.</p><div className="lesson-meta"><span>8 min</span><span>5 steps</span><span><Icon name="star" size={15}/>40 stars</span></div><Button icon="play" onClick={startTutorial}>Start lesson</Button></div><div className="feature-progress"><span>YOUR PROGRESS</span><b>0 / 5</b></div></div><div className="list-heading"><div><h2>Explore all lessons</h2><p>Choose a look and learn at your own pace.</p></div><div className="filter-pills"><button className="active">All</button><button>Beginner</button><button>Intermediate</button><button>Advanced</button></div></div><div className="tutorial-grid">{tutorials.map((t,i)=><button className="tutorial-tile" key={t.title} onClick={startTutorial}><div className="tutorial-art" style={{background:`linear-gradient(135deg,${t.colors[0]},${t.colors[1]})`}}><ModelFace model={models[(i+1)%models.length]} compact applied={i%2?{Lipstick:t.colors[1],Blush:t.colors[0]}:{Eyeshadow:t.colors[1],Lipstick:t.colors[0]}}/><span className="play-circle"><Icon name="play"/></span></div><div className="tutorial-info"><span className={`difficulty d-${t.level.toLowerCase()}`}>{t.level}</span><h3>{t.title}</h3><div><span>{t.time}</span><span>{t.steps} steps</span><span><Icon name="star" size={13}/>{t.reward}</span></div></div></button>)}</div></main><Footer setPage={setPage}/></>;
}

function Challenges({setPage,startChallenge}:{setPage:(p:Page)=>void;startChallenge:(s:string)=>void}) {
  return <><Header page="challenges" setPage={setPage}/><main className="inner-page"><PageIntro kicker="THE GLOW LEAGUE" title="Your next creative" italic="challenge awaits." text="Complete themed looks, collect stars, and build your beauty streak."/><div className="daily-card"><div className="daily-copy"><span className="pill">TODAY’S FEATURED CHALLENGE</span><h2>Blushing Rose</h2><p>Create a soft pink look using at least three shades. Complete it before midnight for a streak bonus.</p><div className="challenge-data"><span><small>REWARD</small><b><Icon name="star" size={16}/>100 stars</b></span><span><small>DIFFICULTY</small><b>Easy</b></span><span><small>TIME LEFT</small><b>08:42:16</b></span></div><Button icon="trophy" onClick={()=>startChallenge("Blushing Rose")}>Start daily challenge</Button></div><div className="daily-art"><ModelFace model={models[4]} applied={{Blush:"#D96582",Eyeshadow:"#B95E7D",Lipstick:"#A92F4B"}}/><div className="streak"><b>3</b><span>DAY<br/>STREAK</span></div></div></div><div className="list-heading"><div><h2>More challenges</h2><p>New creative prompts are added every week.</p></div><span className="star-balance"><Icon name="star"/>640 stars earned</span></div><div className="challenge-grid">{challenges.map((c,i)=><article className="challenge-tile" key={c.title}><div className="challenge-art"><ModelFace model={models[(i+3)%models.length]} compact applied={{Blush:c.colors[0],Eyeshadow:c.colors[1],Lipstick:c.colors[1]}}/><div className="palette-chip">{c.colors.map(x=><i key={x} style={{background:x}}/>)}</div></div><div className="challenge-info"><div><span className="difficulty">{c.difficulty}</span><span><Icon name="star" size={14}/>{c.reward}</span></div><h3>{c.title}</h3><p>{c.desc}</p><Button variant="secondary" onClick={()=>startChallenge(c.title)}>Start challenge</Button></div></article>)}</div></main><Footer setPage={setPage}/></>;
}

type SavedLook={id:number;name:string;date:string;model:number;applied:Applied;favorite:boolean};
function Looks({setPage,looks,setLooks}:{setPage:(p:Page)=>void;looks:SavedLook[];setLooks:(x:SavedLook[])=>void}) {
  return <><Header page="looks" setPage={setPage}/><main className="inner-page looks-page"><PageIntro kicker="MY LOOKS" title="Your creative" italic="beauty archive." text="Revisit, refine, and celebrate every look you’ve created."/><div className="gallery-bar"><div><button className="active">All looks <span>{looks.length}</span></button><button>Favorites</button></div><Button icon="plus" onClick={()=>setPage("studio")}>Create new look</Button></div>{looks.length===0?<div className="empty-state"><span><Icon name="image" size={34}/></span><h2>Your creativity starts here.</h2><p>Create your first makeup look and it will be saved in this personal gallery.</p><Button icon="brush" onClick={()=>setPage("studio")}>Open Makeup Studio</Button></div>:<div className="looks-grid">{looks.map((look)=><article className="look-card" key={look.id}><div className="look-art"><ModelFace model={models[look.model]} applied={look.applied}/><button className="favorite"><Icon name="heart" size={17}/></button></div><div className="look-info"><div><h3>{look.name}</h3><p>{look.date} · {models[look.model].name}</p></div><div className="look-actions"><button title="Download"><Icon name="download"/></button><button title="Delete" onClick={()=>window.confirm("Delete this saved look?")&&setLooks(looks.filter(x=>x.id!==look.id))}><Icon name="trash"/></button></div></div><Button variant="secondary" onClick={()=>setPage("studio")}>Open in studio</Button></article>)}</div>}</main></>;
}

function ProgressPage({setPage}:{setPage:(p:Page)=>void}) {
  const badges=[["sparkle","First Look Created"],["book","First Tutorial"],["brush","Color Explorer"],["trophy","Challenge Champion"],["star","Three-Day Creator"]];
  return <><Header page="progress" setPage={setPage}/><main className="inner-page"><PageIntro kicker="PROGRESS & REWARDS" title="Every creation makes you" italic="shine brighter." text="Track your journey, celebrate milestones, and discover what’s next."/><div className="progress-hero"><div className="level-orbit"><span><Icon name="star" size={34}/></span><b>02</b><small>CURRENT LEVEL</small></div><div className="progress-main"><span className="kicker">COLOR EXPLORER</span><h2>360 stars until Makeup Artist</h2><div className="progress-label"><span>640 stars</span><span>1,000 stars</span></div><div className="progress large"><i style={{width:"64%"}}/></div><div className="progress-stats"><span><b>7</b>Looks created</span><span><b>4</b>Tutorials complete</span><span><b>3</b>Challenges won</span></div></div></div><div className="achievement-section"><div className="list-heading"><div><h2>Achievement cabinet</h2><p>Small moments, beautiful milestones.</p></div><span>4 of 12 unlocked</span></div><div className="badge-grid">{badges.map(([icon,label],i)=><div className={`badge-card ${i===4?"locked":""}`} key={label}><span><Icon name={icon} size={28}/></span><b>{label}</b><small>{i===4?"Create looks 3 days in a row":"Unlocked"}</small></div>)}</div></div></main></>;
}

function Completion({challenge,onReplay,onSave,onOther,model,applied}:{challenge:string;onReplay:()=>void;onSave:()=>void;onOther:()=>void;model:typeof models[number];applied:Applied}) {
  return <div className="completion"><div className="confetti c1"/><div className="confetti c2"/><div className="completion-card"><div className="completion-art"><ModelFace model={model} applied={applied}/><span className="complete-check"><Icon name="check" size={26}/></span></div><div className="completion-copy"><span className="kicker">{challenge?"CHALLENGE COMPLETE":"LESSON COMPLETE"}</span><h1>{challenge?"You rose to the challenge.":"Beautiful work!"}</h1><p>{challenge?"Your finished look met all three creative goals.":"You’ve mastered the five steps of an everyday natural look."}</p><div className="earned"><small>YOU EARNED</small><div>{[1,2,3].map(x=><Icon key={x} name="star" size={28}/>)}</div><b>+{challenge?80:40} stars</b></div><div className="score-row"><span><small>COMPLETION</small><b>100%</b></span><span><small>STEPS FINISHED</small><b>{challenge?"3 / 3":"5 / 5"}</b></span></div><div className="completion-actions"><Button variant="secondary" onClick={onReplay}>Play again</Button><Button icon="save" onClick={onSave}>Save look</Button></div><button className="other-link" onClick={onOther}>Try another {challenge?"challenge":"lesson"} <Icon name="chevron" size={14}/></button></div></div></div>;
}

function PageIntro({kicker,title,italic,text}:{kicker:string;title:string;italic:string;text:string}) {
  return <div className="page-intro"><span className="kicker">{kicker}</span><h1>{title} <em>{italic}</em></h1><p>{text}</p></div>;
}

function Footer({setPage}:{setPage:(p:Page)=>void}) {
  return <footer><Logo/><p>Where creativity meets confidence.</p><div>{["About","Contact","Privacy Policy","Terms","Help"].map(x=><button key={x} onClick={()=>setPage("home")}>{x}</button>)}</div><small>© 2025 GlowPlay Studio. Made for creative play.</small></footer>;
}

export default function App() {
  const [page,setPage]=useState<Page>("home");
  const [tutorialMode,setTutorialMode]=useState(false);
  const [challenge,setChallenge]=useState("");
  const [looks,setLooksState]=useState<SavedLook[]>(()=>{
    try{return JSON.parse(localStorage.getItem("glowplay-looks")||"[]")}catch{return []}
  });
  const setLooks=(next:SavedLook[])=>{setLooksState(next);localStorage.setItem("glowplay-looks",JSON.stringify(next))};
  const saveLook=(model:number,applied:Applied)=>setLooks([{id:Date.now(),name:"Rosewater glow",date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),model,applied,favorite:false},...looks]);
  const content=useMemo(()=>{
    if(page==="studio") return <Studio setPage={setPage} tutorial={tutorialMode} challenge={challenge} onSave={saveLook}/>;
    if(page==="school") return <School setPage={setPage} startTutorial={()=>{setTutorialMode(true);setChallenge("");setPage("studio")}}/>;
    if(page==="challenges") return <Challenges setPage={setPage} startChallenge={(c)=>{setChallenge(c);setTutorialMode(false);setPage("studio")}}/>;
    if(page==="looks") return <Looks setPage={setPage} looks={looks} setLooks={setLooks}/>;
    if(page==="progress") return <ProgressPage setPage={setPage}/>;
    return <Home setPage={(p)=>{setTutorialMode(false);setChallenge("");setPage(p)}}/>;
  },[page,tutorialMode,challenge,looks]);
  return content;
}
