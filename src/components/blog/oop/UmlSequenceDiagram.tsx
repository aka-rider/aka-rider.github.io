import {
  BOX_CLASSES,
  FONT_SIZE,
  markerUrl,
  SVG_CLASSES,
  TEXT_BASELINE_OFFSET,
  UmlMarkers,
} from '@/components/blog/oop/uml';

const MARKER_PREFIX = 'umlSequence';

const HEAD_TOP = 10;
const HEAD_WIDTH = 120;
const HEAD_HEIGHT = 40;
const LIFELINE_END = 480;
const ACTIVATION_WIDTH = 16;
const LABEL_GAP = 8;

const COMPUTER_X = 200;
const SERVER_X = 440;
const FOUND_MESSAGE_X = 30;

const CHECK_EMAIL_Y = 90;
const COMPUTER_ACTIVATION_END = 450;
const SERVER_ACTIVATION_HEIGHT = 40;

type Call = { y: number; label: string; reply?: string };

const CALLS: readonly Call[] = [
  { y: 130, label: 'sendUnsentEmail' },
  { y: 210, label: 'newEmail', reply: 'response' },
  { y: 300, label: '[newEmail] downloadEmail' },
  { y: 380, label: 'deleteOldEmail' },
];

const COMPUTER_ACTIVATION_RIGHT = COMPUTER_X + ACTIVATION_WIDTH / 2;
const SERVER_ACTIVATION_LEFT = SERVER_X - ACTIVATION_WIDTH / 2;
const MESSAGE_LABEL_X =
  (COMPUTER_ACTIVATION_RIGHT + SERVER_ACTIVATION_LEFT) / 2;

function Lifeline({ x, name }: { x: number; name: string }) {
  return (
    <g>
      <line
        x1={x}
        y1={HEAD_TOP + HEAD_HEIGHT}
        x2={x}
        y2={LIFELINE_END}
        stroke='currentColor'
        strokeDasharray='4 4'
      />
      <rect
        x={x - HEAD_WIDTH / 2}
        y={HEAD_TOP}
        width={HEAD_WIDTH}
        height={HEAD_HEIGHT}
        className={BOX_CLASSES}
        stroke='currentColor'
      />
      <text
        x={x}
        y={HEAD_TOP + HEAD_HEIGHT / 2 + TEXT_BASELINE_OFFSET}
        textAnchor='middle'
        fill='currentColor'
      >
        {name}
      </text>
    </g>
  );
}

function Activation({
  x,
  top,
  bottom,
}: {
  x: number;
  top: number;
  bottom: number;
}) {
  return (
    <rect
      x={x - ACTIVATION_WIDTH / 2}
      y={top}
      width={ACTIVATION_WIDTH}
      height={bottom - top}
      className={BOX_CLASSES}
      stroke='currentColor'
    />
  );
}

function Message({
  fromX,
  toX,
  y,
  label,
  labelX,
  reply = false,
}: {
  fromX: number;
  toX: number;
  y: number;
  label: string;
  labelX: number;
  reply?: boolean;
}) {
  return (
    <g>
      <line
        x1={fromX}
        y1={y}
        x2={toX}
        y2={y}
        stroke='currentColor'
        strokeDasharray={reply ? '5 4' : undefined}
        markerEnd={markerUrl(MARKER_PREFIX, reply ? 'open' : 'filled')}
      />
      <text
        x={labelX}
        y={y - LABEL_GAP}
        textAnchor='middle'
        fill='currentColor'
      >
        {label}
      </text>
    </g>
  );
}

export default function UmlSequenceDiagram() {
  return (
    <figure className='my-8'>
      <svg
        viewBox='0 0 520 490'
        role='img'
        aria-label='UML sequence diagram: checkEmail reaches Computer, which calls Server with sendUnsentEmail, then newEmail and receives a response, then downloadEmail if there is new email, then deleteOldEmail.'
        className={`${SVG_CLASSES} max-w-[520px]`}
      >
        <UmlMarkers prefix={MARKER_PREFIX} />
        <g
          fontFamily='var(--font-mono)'
          fontSize={FONT_SIZE}
          strokeWidth={1.25}
        >
          <Lifeline x={COMPUTER_X} name=':Computer' />
          <Lifeline x={SERVER_X} name=':Server' />

          <circle
            cx={FOUND_MESSAGE_X}
            cy={CHECK_EMAIL_Y}
            r={5}
            fill='currentColor'
          />
          <Message
            fromX={FOUND_MESSAGE_X}
            toX={COMPUTER_X - ACTIVATION_WIDTH / 2}
            y={CHECK_EMAIL_Y}
            label='checkEmail'
            labelX={(FOUND_MESSAGE_X + COMPUTER_X) / 2}
          />
          <Activation
            x={COMPUTER_X}
            top={CHECK_EMAIL_Y}
            bottom={COMPUTER_ACTIVATION_END}
          />

          {CALLS.map((call) => (
            <g key={call.label}>
              <Message
                fromX={COMPUTER_ACTIVATION_RIGHT}
                toX={SERVER_ACTIVATION_LEFT}
                y={call.y}
                label={call.label}
                labelX={MESSAGE_LABEL_X}
              />
              <Activation
                x={SERVER_X}
                top={call.y}
                bottom={call.y + SERVER_ACTIVATION_HEIGHT}
              />
              {call.reply && (
                <Message
                  fromX={SERVER_ACTIVATION_LEFT}
                  toX={COMPUTER_ACTIVATION_RIGHT}
                  y={call.y + SERVER_ACTIVATION_HEIGHT}
                  label={call.reply}
                  labelX={MESSAGE_LABEL_X}
                  reply
                />
              )}
            </g>
          ))}
        </g>
      </svg>
    </figure>
  );
}
