import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Wallet, Home as HomeIcon, Heart, Dumbbell, Users, Briefcase,
  TrendingUp, GraduationCap, Sparkles, Check, Plus, X, Pencil,
  ChevronLeft, ChevronRight, Sunrise, Sun, Moon, Mic, RotateCcw,
} from "lucide-react";

/* ---------------------------------------------------------
   TOKENS — identidade visual All Win Academy
--------------------------------------------------------- */
const C = {
  cream: "#FAF7F2",
  creamSoft: "#F1E9DC",
  creamLine: "#E7DCC9",
  ink: "#1F1A18",
  inkSoft: "#7A6E64",
  wine: "#360000",
  wineRead: "#4E0D16",
  wineSoft: "#F1E1DE",
  gold: "#C9A15A",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Manrope:wght@400;500;600;700;800&display=swap');
`;

const CATEGORY_META = {
  NEGOCIO: { label: "Negócio", icon: Briefcase },
  VENDAS: { label: "Vendas", icon: TrendingUp },
  HBS: { label: "HBS", icon: GraduationCap },
  FINANCEIRO: { label: "Financeiro", icon: Wallet },
  CASA: { label: "Casa", icon: HomeIcon },
  FAMILIA: { label: "Família", icon: Users },
  AUTOCUIDADO: { label: "Autocuidado", icon: Heart },
  TREINO: { label: "Treino", icon: Dumbbell },
  PESSOAL: { label: "Pessoal", icon: Sparkles },
};

const PRIORITY_META = {
  essencial: { label: "Essencial", weight: 3 },
  importante: { label: "Importante", weight: 2 },
  se_der: { label: "Se der", weight: 1 },
};

/* ---------------------------------------------------------
   DADOS INICIAIS DA SEMANA
--------------------------------------------------------- */
let uid = 1;
const t = (text, category, priority) => ({
  id: `t${uid++}`,
  text,
  category,
  priority,
  done: false,
});

const INITIAL_WEEK = [
  {
    key: "seg",
    label: "SEG",
    date: "07",
    fullName: "Segunda-feira",
    weekday: 1,
    foco: null,
    periods: {
      manha: [],
      atendimentos: [t("Sessões de atendimento", "NEGOCIO", "essencial")],
      noite: [],
    },
  },
  {
    key: "ter",
    label: "TER",
    date: "08",
    fullName: "Terça-feira",
    weekday: 2,
    foco: ["Organizar pagamentos", "Treino", "Matrícula HBS"],
    periods: {
      manha: [
        t("Verificar dinheiro do condomínio", "FINANCEIRO", "essencial"),
        t("Verificar dinheiro da escola das crianças", "FINANCEIRO", "essencial"),
        t("Deixar pagamentos organizados para dia 10", "FINANCEIRO", "essencial"),
        t("Remarcar harmonização facial para a próxima semana", "AUTOCUIDADO", "se_der"),
        t("Treino", "TREINO", "essencial"),
        t("Lavar roupa", "CASA", "se_der"),
        t("Comprar sabão em pó", "CASA", "se_der"),
        t("Tarefas da Maya", "FAMILIA", "importante"),
        t("Finalizar matrícula HBS", "HBS", "essencial"),
      ],
      atendimentos: [t("Sessões de atendimento", "NEGOCIO", "essencial")],
      noite: [t("Revisão leve da semana e descanso", "PESSOAL", "se_der")],
    },
  },
  {
    key: "qua",
    label: "QUA",
    date: "09",
    fullName: "Quarta-feira",
    weekday: 3,
    foco: null,
    periods: {
      manha: [
        t("Estudar material HBS", "HBS", "importante"),
        t("Finalizar materiais HBS", "HBS", "importante"),
        t("Finalizar protocolos das alunas", "NEGOCIO", "importante"),
        t("Prospecção ativa", "VENDAS", "importante"),
        t("Mostrar compras da Shopee", "PESSOAL", "se_der"),
      ],
      atendimentos: [t("Sessões de atendimento", "NEGOCIO", "essencial")],
      noite: [t("Áudio diário, caso seja dia", "PESSOAL", "se_der")],
    },
  },
  {
    key: "qui",
    label: "QUI",
    date: "10",
    fullName: "Quinta-feira",
    weekday: 4,
    foco: null,
    periods: {
      manha: [
        t("Conferir pagamento do condomínio", "FINANCEIRO", "essencial"),
        t("Conferir pagamento da escola", "FINANCEIRO", "essencial"),
        t("Treino", "TREINO", "essencial"),
        t("Falar com advogada", "NEGOCIO", "essencial"),
        t("Avançar nos sites", "NEGOCIO", "importante"),
        t("HBS", "HBS", "importante"),
      ],
      atendimentos: [t("Sessões de atendimento", "NEGOCIO", "essencial")],
      noite: [],
    },
  },
  {
    key: "sex",
    label: "SEX",
    date: "11",
    fullName: "Sexta-feira",
    weekday: 5,
    foco: null,
    periods: {
      manha: [
        t("Pilates", "TREINO", "essencial"),
        t("Progressiva", "AUTOCUIDADO", "se_der"),
        t("Medir cabelo", "AUTOCUIDADO", "se_der"),
        t("Áudio, caso seja dia", "PESSOAL", "se_der"),
      ],
      atendimentos: [t("Sessões de atendimento", "NEGOCIO", "essencial")],
      noite: [],
    },
  },
  {
    key: "sab",
    label: "SÁB",
    date: "12",
    fullName: "Sábado",
    weekday: 6,
    foco: null,
    periods: {
      manha: [
        t("Treino", "TREINO", "essencial"),
        t("Prospecção ativa", "VENDAS", "importante"),
        t("Sites", "NEGOCIO", "importante"),
        t("Finalizações HBS", "HBS", "importante"),
      ],
      atendimentos: [],
      noite: [],
    },
    livre: true,
  },
  {
    key: "dom",
    label: "DOM",
    date: "13",
    fullName: "Domingo",
    weekday: 0,
    foco: null,
    reset: true,
    periods: {
      manha: [
        t("Revisar a semana", "PESSOAL", "essencial"),
        t("Verificar pendências", "PESSOAL", "essencial"),
        t("Planejar a próxima semana", "PESSOAL", "essencial"),
        t("Definir 3 prioridades", "PESSOAL", "essencial"),
      ],
      atendimentos: [],
      noite: [],
    },
  },
];

const HBS_INITIAL = [
  { key: "matricula", label: "Matrícula", pct: 80 },
  { key: "materiais", label: "Materiais", pct: 70 },
  { key: "protocolos", label: "Protocolos", pct: 60 },
  { key: "estudo", label: "Estudo", pct: 40 },
  { key: "sites", label: "Sites", pct: 30 },
  { key: "advogada", label: "Advogada", pct: 0 },
];

const BUSINESS_INITIAL = {
  meta: "",
  faturamento: "",
  prospeccoes: "",
  conversas: "",
  propostas: "",
  vendas: "",
};

const AUDIO_INITIAL = {
  proximo: "Amanhã",
  frequencia: "Dia sim, dia não",
  tema: "",
};

const PHRASES = [
  "Disciplina também é decidir o que não entra na sua agenda.",
  "Organização não é fazer mais. É desperdiçar menos energia.",
  "Seu negócio cresce na medida em que você aprende a conduzi-lo.",
  "Uma mulher organizada não controla tudo. Ela sabe o que merece sua atenção.",
];

const PROGRESS_MESSAGES = [
  { min: 100, text: "Semana concluída." },
  { min: 75, text: "Olha o quanto já avançou." },
  { min: 50, text: "Você está no controle." },
  { min: 25, text: "Começamos." },
  { min: 0, text: "Você está construindo a semana que queria viver." },
];

const MONTHS = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const WEEKDAY_NAMES = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];

const STORAGE_KEY = "myweek:v1";

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */
function allTasks(week) {
  const out = [];
  week.forEach((d) => {
    ["manha", "atendimentos", "noite"].forEach((p) => {
      d.periods[p].forEach((task) => out.push({ ...task, day: d.key, period: p }));
    });
  });
  return out;
}

function weekProgress(week) {
  const tasks = allTasks(week);
  if (tasks.length === 0) return 0;
  const done = tasks.filter((x) => x.done).length;
  return Math.round((done / tasks.length) * 100);
}

function progressMessage(pct) {
  return PROGRESS_MESSAGES.find((m) => pct >= m.min)?.text || "";
}

function todayIndex() {
  const wd = new Date().getDay();
  const idx = INITIAL_WEEK.findIndex((d) => d.weekday === wd);
  return idx === -1 ? 1 : idx;
}

/* ---------------------------------------------------------
   COMPONENTES BASE
--------------------------------------------------------- */

function CategoryTag({ category }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.PESSOAL;
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ background: C.creamSoft, color: C.inkSoft, letterSpacing: "0.02em" }}
    >
      <Icon size={12} strokeWidth={2} />
      {meta.label}
    </span>
  );
}

function PriorityDot({ priority }) {
  const color =
    priority === "essencial" ? C.wine : priority === "importante" ? C.gold : C.creamLine;
  return (
    <span
      className="inline-block rounded-full flex-shrink-0"
      style={{ width: 7, height: 7, background: color }}
    />
  );
}

function TaskRow({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);

  return (
    <div
      className="group flex items-start gap-3 py-3 px-1 transition-all"
      style={{ borderBottom: `1px solid ${C.creamLine}` }}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? "Desmarcar tarefa" : "Concluir tarefa"}
        className="mt-0.5 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: 22,
          height: 22,
          border: `1.5px solid ${task.done ? C.wine : C.inkSoft}`,
          background: task.done ? C.wine : "transparent",
        }}
      >
        {task.done && <Check size={13} color={C.cream} strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && draft.trim()) {
                  onEdit(task.id, draft.trim());
                  setEditing(false);
                }
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-full bg-transparent outline-none text-[15px] pb-0.5"
              style={{ color: C.ink, borderBottom: `1px solid ${C.wine}`, fontFamily: "Manrope, sans-serif" }}
            />
            <button
              onClick={() => {
                if (draft.trim()) onEdit(task.id, draft.trim());
                setEditing(false);
              }}
              style={{ color: C.wine }}
              className="text-xs font-semibold flex-shrink-0"
            >
              Salvar
            </button>
          </div>
        ) : (
          <p
            className="text-[15px] leading-snug transition-all duration-300"
            style={{
              color: task.done ? C.inkSoft : C.ink,
              textDecoration: task.done ? "line-through" : "none",
              textDecorationColor: C.inkSoft,
              fontFamily: "Manrope, sans-serif",
            }}
          >
            {task.text}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <PriorityDot priority={task.priority} />
          <span className="text-[11px]" style={{ color: C.inkSoft }}>
            {PRIORITY_META[task.priority]?.label}
          </span>
          <CategoryTag category={task.category} />
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => setEditing((v) => !v)}
          aria-label="Editar tarefa"
          className="p-1.5 rounded-full hover:bg-black/5"
        >
          <Pencil size={13} color={C.inkSoft} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          aria-label="Excluir tarefa"
          className="p-1.5 rounded-full hover:bg-black/5"
        >
          <X size={14} color={C.inkSoft} />
        </button>
      </div>
    </div>
  );
}

function AddTaskRow({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("PESSOAL");
  const [priority, setPriority] = useState("importante");

  const submit = () => {
    if (!text.trim()) return;
    onAdd({ text: text.trim(), category, priority });
    setText("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 py-3 px-1 text-[14px] w-full text-left"
        style={{ color: C.inkSoft, fontFamily: "Manrope, sans-serif" }}
      >
        <Plus size={16} />
        Adicionar tarefa
      </button>
    );
  }

  return (
    <div className="py-3 px-1 space-y-2.5" style={{ borderBottom: `1px solid ${C.creamLine}` }}>
      <input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Escreva a tarefa"
        className="w-full bg-transparent outline-none text-[15px] pb-1"
        style={{ color: C.ink, borderBottom: `1px solid ${C.creamLine}`, fontFamily: "Manrope, sans-serif" }}
      />
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="text-[12px] rounded-full px-2.5 py-1 outline-none"
          style={{ background: C.creamSoft, color: C.ink, fontFamily: "Manrope, sans-serif" }}
        >
          {Object.entries(CATEGORY_META).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="text-[12px] rounded-full px-2.5 py-1 outline-none"
          style={{ background: C.creamSoft, color: C.ink, fontFamily: "Manrope, sans-serif" }}
        >
          {Object.entries(PRIORITY_META).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <button
          onClick={submit}
          className="text-[12px] font-semibold rounded-full px-3 py-1"
          style={{ background: C.wine, color: C.cream, fontFamily: "Manrope, sans-serif" }}
        >
          Adicionar
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-[12px]"
          style={{ color: C.inkSoft, fontFamily: "Manrope, sans-serif" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p
          className="text-[11px] font-semibold mb-2"
          style={{ color: C.gold, letterSpacing: "0.14em", textTransform: "uppercase" }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="text-[28px] leading-tight"
        style={{ color: C.ink, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-[14px] mt-1.5" style={{ color: C.inkSoft, fontFamily: "Manrope, sans-serif" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Card({ children, style, className = "" }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: "#FFFFFFAA", border: `1px solid ${C.creamLine}`, ...style }}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------
   TELA: HOJE
--------------------------------------------------------- */
function ScreenHoje({ day, onToggle, audio }) {
  const periodLabels = { manha: "Manhã", atendimentos: "Atendimentos", noite: "Noite" };
  const periodIcons = { manha: Sunrise, atendimentos: Sun, noite: Moon };

  const scheduleFor = (d) => {
    if (d.key === "ter") {
      return [
        { time: "08:00", text: "Treino", cat: "TREINO" },
        { time: "09:30", text: "Pagamentos", cat: "FINANCEIRO" },
        { time: "10:00", text: "Matrícula HBS", cat: "HBS" },
        { time: "11:00", text: "Casa", cat: "CASA" },
        { time: "13:00", text: "Atendimentos", cat: "NEGOCIO" },
      ];
    }
    const morning = d.periods.manha.filter((x) => x.priority !== "se_der").slice(0, 5);
    let hour = 8, min = 0;
    const items = morning.map((task) => {
      const time = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      min += 30;
      if (min >= 60) { min -= 60; hour += 1; }
      return { time, text: task.text, cat: task.category };
    });
    if (d.periods.atendimentos.length) {
      items.push({ time: "13:00", text: "Atendimentos", cat: "NEGOCIO" });
    }
    return items;
  };

  const agenda = scheduleFor(day);
  const doneCount = allDayTasks(day).filter((x) => x.done).length;
  const totalCount = allDayTasks(day).length;

  return (
    <div>
      <SectionTitle
        eyebrow={day.fullName}
        title="Hoje"
        subtitle={`${doneCount} de ${totalCount} tarefas concluídas`}
      />

      <Card style={{ padding: "1.5rem" }} className="mb-6">
        <p className="text-[12px] font-semibold mb-4" style={{ color: C.inkSoft, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Sua agenda executiva
        </p>
        <div className="space-y-0">
          {agenda.map((item, i) => (
            <div key={i} className="flex items-start gap-4 py-3" style={{ borderTop: i > 0 ? `1px solid ${C.creamLine}` : "none" }}>
              <span
                className="text-[13px] font-semibold flex-shrink-0 pt-0.5"
                style={{ color: C.wineRead, fontFamily: "Manrope, sans-serif", minWidth: 44 }}
              >
                {item.time}
              </span>
              <span className="text-[15px]" style={{ color: C.ink, fontFamily: "Manrope, sans-serif" }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {day.foco && (
        <Card style={{ padding: "1.5rem", background: C.wine }} className="mb-6">
          <p className="text-[11px] font-semibold mb-3" style={{ color: C.gold, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Foco de hoje
          </p>
          <div className="space-y-2.5">
            {day.foco.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="text-[13px] font-semibold flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ width: 22, height: 22, background: "rgba(255,255,255,0.12)", color: C.gold }}
                >
                  {i + 1}
                </span>
                <span className="text-[16px]" style={{ color: C.cream, fontFamily: "'Playfair Display', serif" }}>
                  {f}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {["manha", "atendimentos", "noite"].map((period) => {
        const tasks = day.periods[period];
        if (!tasks.length) return null;
        const Icon = periodIcons[period];
        return (
          <div key={period} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={15} color={C.wineRead} />
              <p className="text-[12px] font-semibold" style={{ color: C.wineRead, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {periodLabels[period]}
              </p>
            </div>
            <Card style={{ padding: "0.25rem 1rem" }}>
              {tasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={(id) => onToggle(day.key, period, id)} onDelete={() => {}} onEdit={() => {}} />
              ))}
            </Card>
          </div>
        );
      })}

      {audio.tema && (
        <Card style={{ padding: "1.25rem" }} className="flex items-center gap-3">
          <Mic size={16} color={C.wineRead} />
          <p className="text-[13px]" style={{ color: C.inkSoft, fontFamily: "Manrope, sans-serif" }}>
            Próximo áudio {audio.proximo.toLowerCase()} — tema: {audio.tema}
          </p>
        </Card>
      )}
    </div>
  );
}

function allDayTasks(day) {
  return [...day.periods.manha, ...day.periods.atendimentos, ...day.periods.noite];
}

/* ---------------------------------------------------------
   TELA: MINHA SEMANA
--------------------------------------------------------- */
function ScreenSemana({ week, selected, setSelected, onToggle, onAdd, onDelete, onEdit, audio, setAudio }) {
  const day = week[selected];
  const pct = weekProgress(week);
  const periodLabels = { manha: "Manhã", atendimentos: "Atendimentos", noite: "Noite" };

  return (
    <div>
      <SectionTitle eyebrow="Minha semana" title="Organize o que importa" subtitle="Conduza o que cresce" />

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold" style={{ color: C.wineRead, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Progresso da semana
          </span>
          <span className="text-[13px] font-semibold" style={{ color: C.ink, fontFamily: "Manrope, sans-serif" }}>
            {pct}%
          </span>
        </div>
        <div className="w-full h-[6px] rounded-full overflow-hidden" style={{ background: C.creamSoft }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: C.wine }} />
        </div>
        <p className="text-[13px] italic mt-2" style={{ color: C.inkSoft, fontFamily: "'Playfair Display', serif" }}>
          {progressMessage(pct)}
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {week.map((d, i) => {
          const active = i === selected;
          const dayDone = allDayTasks(d).filter((x) => x.done).length;
          const dayTotal = allDayTasks(d).length;
          return (
            <button
              key={d.key}
              onClick={() => setSelected(i)}
              className="flex flex-col items-center justify-center rounded-xl flex-shrink-0 transition-all duration-200"
              style={{
                width: 58,
                height: 68,
                background: active ? C.wine : C.creamSoft,
                border: `1px solid ${active ? C.wine : C.creamLine}`,
              }}
            >
              <span
                className="text-[11px] font-semibold"
                style={{ color: active ? C.gold : C.inkSoft, letterSpacing: "0.05em" }}
              >
                {d.label}
              </span>
              <span
                className="text-[17px] mt-0.5"
                style={{ color: active ? C.cream : C.ink, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
              >
                {d.date}
              </span>
              {dayTotal > 0 && (
                <span className="text-[9px] mt-0.5" style={{ color: active ? "rgba(250,247,242,0.7)" : C.inkSoft }}>
                  {dayDone}/{dayTotal}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {day.reset ? (
        <ResetSemana day={day} onToggle={onToggle} />
      ) : day.livre && allDayTasks(day).filter((x) => x.period !== "manha").length === 0 ? (
        <>
          <DayPeriods day={day} onToggle={onToggle} onAdd={onAdd} onDelete={onDelete} onEdit={onEdit} periodLabels={periodLabels} />
          <Card style={{ padding: "1.5rem" }} className="mt-6 text-center">
            <p className="text-[15px]" style={{ color: C.inkSoft, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
              Tarde e noite livres. O descanso também faz parte da condução.
            </p>
          </Card>
        </>
      ) : (
        <DayPeriods day={day} onToggle={onToggle} onAdd={onAdd} onDelete={onDelete} onEdit={onEdit} periodLabels={periodLabels} />
      )}

      <AudioWidget audio={audio} setAudio={setAudio} />
    </div>
  );
}

function DayPeriods({ day, onToggle, onAdd, onDelete, onEdit, periodLabels }) {
  return (
    <>
      {["manha", "atendimentos", "noite"].map((period) => (
        <div key={period} className="mb-6">
          <p className="text-[12px] font-semibold mb-3" style={{ color: C.wineRead, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {periodLabels[period]}
          </p>
          <Card style={{ padding: "0.25rem 1rem" }}>
            {day.periods[period].map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={(id) => onToggle(day.key, period, id)}
                onDelete={(id) => onDelete(day.key, period, id)}
                onEdit={(id, text) => onEdit(day.key, period, id, text)}
              />
            ))}
            <AddTaskRow onAdd={(data) => onAdd(day.key, period, data)} />
          </Card>
        </div>
      ))}
    </>
  );
}

function ResetSemana({ day, onToggle }) {
  return (
    <div className="mb-6">
      <Card style={{ padding: "1.75rem", background: C.wine }}>
        <p className="text-[11px] font-semibold mb-2" style={{ color: C.gold, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Reset da semana
        </p>
        <p className="text-[19px] mb-5" style={{ color: C.cream, fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
          Domingo é para olhar para trás com clareza e seguir com direção.
        </p>
        <div className="space-y-0">
          {day.periods.manha.map((task) => (
            <div key={task.id} className="flex items-center gap-3 py-2.5" style={{ borderTop: `1px solid rgba(250,247,242,0.14)` }}>
              <button
                onClick={() => onToggle(day.key, "manha", task.id)}
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  width: 20, height: 20,
                  border: `1.5px solid ${task.done ? C.gold : "rgba(250,247,242,0.5)"}`,
                  background: task.done ? C.gold : "transparent",
                }}
              >
                {task.done && <Check size={12} color={C.wine} strokeWidth={3} />}
              </button>
              <span
                className="text-[15px]"
                style={{
                  color: task.done ? "rgba(250,247,242,0.5)" : C.cream,
                  textDecoration: task.done ? "line-through" : "none",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AudioWidget({ audio, setAudio }) {
  return (
    <Card style={{ padding: "1.5rem" }} className="mt-2">
      <div className="flex items-center gap-2 mb-4">
        <Mic size={15} color={C.wineRead} />
        <p className="text-[12px] font-semibold" style={{ color: C.wineRead, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Áudio da rotina
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px]" style={{ color: C.inkSoft }}>Próximo áudio</label>
          <input
            value={audio.proximo}
            onChange={(e) => setAudio({ ...audio, proximo: e.target.value })}
            className="w-full bg-transparent outline-none text-[15px] pt-1 pb-1.5"
            style={{ color: C.ink, borderBottom: `1px solid ${C.creamLine}`, fontFamily: "Manrope, sans-serif" }}
          />
        </div>
        <div>
          <label className="text-[11px]" style={{ color: C.inkSoft }}>Frequência</label>
          <input
            value={audio.frequencia}
            onChange={(e) => setAudio({ ...audio, frequencia: e.target.value })}
            className="w-full bg-transparent outline-none text-[15px] pt-1 pb-1.5"
            style={{ color: C.ink, borderBottom: `1px solid ${C.creamLine}`, fontFamily: "Manrope, sans-serif" }}
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="text-[11px]" style={{ color: C.inkSoft }}>Tema</label>
        <input
          value={audio.tema}
          onChange={(e) => setAudio({ ...audio, tema: e.target.value })}
          placeholder="Escreva o tema do próximo áudio"
          className="w-full bg-transparent outline-none text-[15px] pt-1 pb-1.5"
          style={{ color: C.ink, borderBottom: `1px solid ${C.creamLine}`, fontFamily: "Manrope, sans-serif" }}
        />
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------
   TELA: MINHA EVOLUÇÃO
--------------------------------------------------------- */
function ScreenEvolucao({ week }) {
  const tasks = allTasks(week);
  const done = tasks.filter((x) => x.done);
  const pending = tasks.length - done.length;
  const diasProdutivos = week.filter((d) => allDayTasks(d).some((t) => t.done)).length;
  const treinos = done.filter((x) => x.category === "TREINO").length;
  const sessoes = done.filter((x) => x.text.toLowerCase().includes("sessões")).length;
  const prospeccoes = done.filter((x) => x.category === "VENDAS").length;
  const negocioHoras = done.filter((x) => ["NEGOCIO", "VENDAS", "HBS"].includes(x.category)).length;

  const metrics = [
    { label: "Concluídas", value: done.length },
    { label: "Pendentes", value: pending },
    { label: "Dias produtivos", value: diasProdutivos },
    { label: "Treinos realizados", value: treinos },
    { label: "Sessões realizadas", value: sessoes },
    { label: "Prospecções", value: prospeccoes },
  ];

  return (
    <div>
      <SectionTitle eyebrow="Minha evolução" title="O que você já conduziu" subtitle={`Estimativa de ${negocioHoras} blocos dedicados ao negócio esta semana`} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {metrics.map((m) => (
          <Card key={m.label} style={{ padding: "1.25rem" }}>
            <p className="text-[28px]" style={{ color: C.wineRead, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
              {m.value}
            </p>
            <p className="text-[12px] mt-1" style={{ color: C.inkSoft, fontFamily: "Manrope, sans-serif" }}>
              {m.label}
            </p>
          </Card>
        ))}
      </div>

      <Card style={{ padding: "1.5rem" }}>
        <p className="text-[12px] font-semibold mb-5" style={{ color: C.wineRead, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Ritmo por dia
        </p>
        <div className="space-y-3.5">
          {week.map((d) => {
            const t = allDayTasks(d);
            const doneD = t.filter((x) => x.done).length;
            const pct = t.length ? Math.round((doneD / t.length) * 100) : 0;
            return (
              <div key={d.key} className="flex items-center gap-3">
                <span className="text-[12px] w-9 flex-shrink-0" style={{ color: C.inkSoft, fontFamily: "Manrope, sans-serif" }}>
                  {d.label}
                </span>
                <div className="flex-1 h-[8px] rounded-full overflow-hidden" style={{ background: C.creamSoft }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: pct === 100 ? C.gold : C.wine }} />
                </div>
                <span className="text-[12px] w-9 text-right flex-shrink-0" style={{ color: C.inkSoft, fontFamily: "Manrope, sans-serif" }}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------
   TELA: BUSINESS MODE
--------------------------------------------------------- */
function ScreenBusiness({ business, setBusiness }) {
  const fields = [
    { key: "meta", label: "Meta da semana" },
    { key: "faturamento", label: "Faturamento" },
    { key: "prospeccoes", label: "Prospecções" },
    { key: "conversas", label: "Conversas" },
    { key: "propostas", label: "Propostas" },
    { key: "vendas", label: "Vendas" },
  ];

  return (
    <div>
      <SectionTitle eyebrow="Business mode" title="Você está administrando o seu negócio" subtitle="Não é apenas organizar a vida. É conduzir o que você construiu." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <Card key={f.key} style={{ padding: "1.25rem" }}>
            <label className="text-[11px]" style={{ color: C.inkSoft, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {f.label}
            </label>
            <input
              value={business[f.key]}
              onChange={(e) => setBusiness({ ...business, [f.key]: e.target.value })}
              placeholder="—"
              className="w-full bg-transparent outline-none text-[22px] pt-1"
              style={{ color: C.wineRead, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   TELA: HBS
--------------------------------------------------------- */
function ScreenHBS({ hbs, setHbs }) {
  const update = (key, pct) => setHbs(hbs.map((h) => (h.key === key ? { ...h, pct } : h)));

  return (
    <div>
      <SectionTitle eyebrow="Em construção" title="HBS" subtitle="Aqui você está construindo patrimônio intelectual, não apenas cumprindo tarefas." />
      <Card style={{ padding: "1.75rem" }}>
        <div className="space-y-6">
          {hbs.map((h) => (
            <div key={h.key}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[15px]" style={{ color: C.ink, fontFamily: "Manrope, sans-serif", fontWeight: 500 }}>
                  {h.label}
                </span>
                <span className="text-[13px]" style={{ color: C.wineRead, fontFamily: "Manrope, sans-serif", fontWeight: 600 }}>
                  {h.pct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={h.pct}
                onChange={(e) => update(h.key, Number(e.target.value))}
                className="w-full"
                style={{ accentColor: C.wine }}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------
   NAVEGAÇÃO
--------------------------------------------------------- */
const TABS = [
  { key: "hoje", label: "Hoje", icon: Sunrise },
  { key: "semana", label: "Semana", icon: Sun },
  { key: "evolucao", label: "Evolução", icon: TrendingUp },
  { key: "business", label: "Negócio", icon: Briefcase },
  { key: "hbs", label: "HBS", icon: GraduationCap },
];

function NavRail({ active, setActive }) {
  return (
    <div
      className="hidden md:flex flex-col flex-shrink-0"
      style={{ width: 220, borderRight: `1px solid ${C.creamLine}`, padding: "2rem 1rem" }}
    >
      <div className="mb-10 px-2">
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.wine }}>
          My Week
        </p>
        <p style={{ color: C.inkSoft, fontSize: 11, letterSpacing: "0.05em", marginTop: 2 }}>
          Minha semana
        </p>
      </div>
      <div className="space-y-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
              style={{ background: isActive ? C.wine : "transparent" }}
            >
              <Icon size={16} color={isActive ? C.gold : C.inkSoft} strokeWidth={1.8} />
              <span
                className="text-[13.5px]"
                style={{ color: isActive ? C.cream : C.ink, fontFamily: "Manrope, sans-serif", fontWeight: isActive ? 600 : 500 }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BottomNav({ active, setActive }) {
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around z-20"
      style={{ background: C.cream, borderTop: `1px solid ${C.creamLine}`, padding: "0.6rem 0.5rem calc(0.6rem + env(safe-area-inset-bottom))" }}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.key;
        return (
          <button key={tab.key} onClick={() => setActive(tab.key)} className="flex flex-col items-center gap-1 px-2">
            <Icon size={18} color={isActive ? C.wine : C.inkSoft} strokeWidth={isActive ? 2.2 : 1.8} />
            <span className="text-[10px]" style={{ color: isActive ? C.wine : C.inkSoft, fontFamily: "Manrope, sans-serif", fontWeight: isActive ? 600 : 500 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------
   APP
--------------------------------------------------------- */
export default function MyWeekApp() {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState("hoje");
  const [week, setWeek] = useState(INITIAL_WEEK);
  const [business, setBusiness] = useState(BUSINESS_INITIAL);
  const [hbs, setHbs] = useState(HBS_INITIAL);
  const [audio, setAudio] = useState(AUDIO_INITIAL);
  const [selectedDay, setSelectedDay] = useState(todayIndex());

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          if (parsed.week) setWeek(parsed.week);
          if (parsed.business) setBusiness(parsed.business);
          if (parsed.hbs) setHbs(parsed.hbs);
          if (parsed.audio) setAudio(parsed.audio);
        }
      } catch (e) {
        /* primeira visita ou chave inexistente */
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const payload = JSON.stringify({ week, business, hbs, audio });
    window.storage.set(STORAGE_KEY, payload, false).catch(() => {});
  }, [week, business, hbs, audio, loaded]);

  const toggleTask = useCallback((dayKey, period, taskId) => {
    setWeek((prev) =>
      prev.map((d) =>
        d.key !== dayKey
          ? d
          : {
              ...d,
              periods: {
                ...d.periods,
                [period]: d.periods[period].map((tk) => (tk.id === taskId ? { ...tk, done: !tk.done } : tk)),
              },
            }
      )
    );
  }, []);

  const addTask = useCallback((dayKey, period, data) => {
    setWeek((prev) =>
      prev.map((d) =>
        d.key !== dayKey
          ? d
          : {
              ...d,
              periods: {
                ...d.periods,
                [period]: [...d.periods[period], { id: `t${Date.now()}`, done: false, ...data }],
              },
            }
      )
    );
  }, []);

  const deleteTask = useCallback((dayKey, period, taskId) => {
    setWeek((prev) =>
      prev.map((d) =>
        d.key !== dayKey
          ? d
          : { ...d, periods: { ...d.periods, [period]: d.periods[period].filter((tk) => tk.id !== taskId) } }
      )
    );
  }, []);

  const editTask = useCallback((dayKey, period, taskId, text) => {
    setWeek((prev) =>
      prev.map((d) =>
        d.key !== dayKey
          ? d
          : {
              ...d,
              periods: {
                ...d.periods,
                [period]: d.periods[period].map((tk) => (tk.id === taskId ? { ...tk, text } : tk)),
              },
            }
      )
    );
  }, []);

  const today = useMemo(() => week[todayIndex()], [week]);

  const now = new Date();
  const headerDate = `${WEEKDAY_NAMES[now.getDay()]}, ${String(now.getDate()).padStart(2, "0")} de ${MONTHS[now.getMonth()]}`;

  const [resetConfirm, setResetConfirm] = useState(false);
  const doReset = () => {
    uid = 1;
    setWeek(INITIAL_WEEK.map((d) => ({ ...d, periods: {
      manha: d.periods.manha.map((x) => ({ ...x, done: false })),
      atendimentos: d.periods.atendimentos.map((x) => ({ ...x, done: false })),
      noite: d.periods.noite.map((x) => ({ ...x, done: false })),
    }})));
    setBusiness(BUSINESS_INITIAL);
    setHbs(HBS_INITIAL);
    setAudio(AUDIO_INITIAL);
    setResetConfirm(false);
  };

  return (
    <div style={{ background: C.cream, minHeight: "100vh", fontFamily: "Manrope, sans-serif" }}>
      <style>{FONTS}</style>

      <div className="flex">
        <NavRail active={active} setActive={setActive} />

        <div className="flex-1 min-w-0">
          <div className="px-5 md:px-10 pt-8 pb-2 flex items-start justify-between">
            <div>
              <p className="text-[12px] uppercase" style={{ color: C.inkSoft, letterSpacing: "0.12em" }}>
                {headerDate}
              </p>
              <h1
                className="mt-1 text-[30px] md:text-[36px] leading-tight"
                style={{ color: C.wine, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
              >
                {active === "hoje" ? "Voltei para a minha rotina." : "My Week"}
              </h1>
              <p className="text-[13px] mt-1" style={{ color: C.inkSoft }}>
                {active === "hoje" ? "Uma semana organizada começa sabendo o que realmente importa." : "Organize o que importa. Conduza o que cresce."}
              </p>
            </div>
            <button
              onClick={() => setResetConfirm(true)}
              aria-label="Reiniciar semana"
              className="p-2 rounded-full flex-shrink-0 mt-1"
              style={{ border: `1px solid ${C.creamLine}` }}
            >
              <RotateCcw size={14} color={C.inkSoft} />
            </button>
          </div>

          {resetConfirm && (
            <div className="mx-5 md:mx-10 mb-2 p-4 rounded-xl flex items-center justify-between flex-wrap gap-3" style={{ background: C.wineSoft }}>
              <p className="text-[13px]" style={{ color: C.wineRead }}>Reiniciar apaga o progresso de toda a semana. Confirma?</p>
              <div className="flex gap-2">
                <button onClick={doReset} className="text-[12px] font-semibold px-3 py-1.5 rounded-full" style={{ background: C.wine, color: C.cream }}>Reiniciar</button>
                <button onClick={() => setResetConfirm(false)} className="text-[12px] px-3 py-1.5 rounded-full" style={{ color: C.inkSoft }}>Cancelar</button>
              </div>
            </div>
          )}

          <div className="px-5 md:px-10 pb-28 md:pb-16 pt-4 max-w-3xl">
            {!loaded ? (
              <p style={{ color: C.inkSoft }} className="text-[14px]">Carregando sua semana…</p>
            ) : active === "hoje" ? (
              <ScreenHoje day={today} onToggle={toggleTask} audio={audio} />
            ) : active === "semana" ? (
              <ScreenSemana
                week={week}
                selected={selectedDay}
                setSelected={setSelectedDay}
                onToggle={toggleTask}
                onAdd={addTask}
                onDelete={deleteTask}
                onEdit={editTask}
                audio={audio}
                setAudio={setAudio}
              />
            ) : active === "evolucao" ? (
              <ScreenEvolucao week={week} />
            ) : active === "business" ? (
              <ScreenBusiness business={business} setBusiness={setBusiness} />
            ) : (
              <ScreenHBS hbs={hbs} setHbs={setHbs} />
            )}
          </div>
        </div>
      </div>

      <BottomNav active={active} setActive={setActive} />
    </div>
  );
}
