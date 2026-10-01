import {
  BOX_CLASSES,
  FONT_SIZE,
  LINE_HEIGHT,
  markerUrl,
  SVG_CLASSES,
  TEXT_BASELINE_OFFSET,
  UmlMarkers,
  UmlNote,
} from '@/components/blog/oop/uml';

const MARKER_PREFIX = 'umlClass';
const HEADER_HEIGHT = 28;
const COMPARTMENT_PADDING = 8;

type Member = { text: string; abstract?: boolean };

type ClassSpec = {
  x: number;
  y: number;
  width: number;
  name: string;
  compartments: readonly (readonly Member[])[];
};

function compartmentHeight(members: readonly Member[]) {
  return Math.max(members.length, 1) * LINE_HEIGHT + COMPARTMENT_PADDING;
}

function classHeight(spec: ClassSpec) {
  return (
    HEADER_HEIGHT +
    spec.compartments.reduce((sum, c) => sum + compartmentHeight(c), 0)
  );
}

function ClassBox({ spec }: { spec: ClassSpec }) {
  const { x, y, width, name, compartments } = spec;
  let compartmentTop = y + HEADER_HEIGHT;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={classHeight(spec)}
        className={BOX_CLASSES}
        stroke='currentColor'
      />
      <text
        x={x + width / 2}
        y={y + HEADER_HEIGHT / 2 + TEXT_BASELINE_OFFSET}
        textAnchor='middle'
        fontWeight='bold'
        fill='currentColor'
      >
        {name}
      </text>
      {compartments.map((members, i) => {
        const top = compartmentTop;
        compartmentTop += compartmentHeight(members);
        return (
          <g key={i}>
            <line
              x1={x}
              y1={top}
              x2={x + width}
              y2={top}
              stroke='currentColor'
            />
            {members.map((member, j) => (
              <text
                key={member.text}
                x={x + 10}
                y={
                  top +
                  COMPARTMENT_PADDING / 2 +
                  LINE_HEIGHT * j +
                  LINE_HEIGHT / 2 +
                  TEXT_BASELINE_OFFSET
                }
                fontStyle={member.abstract ? 'italic' : undefined}
                fill='currentColor'
              >
                {member.text}
              </text>
            ))}
          </g>
        );
      })}
    </g>
  );
}

const CALLER: ClassSpec = {
  x: 190,
  y: 10,
  width: 110,
  name: 'Caller',
  compartments: [[]],
};

const COMMAND: ClassSpec = {
  x: 410,
  y: 10,
  width: 130,
  name: 'Command',
  compartments: [[{ text: 'execute()', abstract: true }]],
};

const RECEIVER: ClassSpec = {
  x: 190,
  y: 140,
  width: 130,
  name: 'Receiver',
  compartments: [[{ text: 'action()', abstract: true }]],
};

const CLIENT: ClassSpec = {
  x: 10,
  y: 170,
  width: 110,
  name: 'Client',
  compartments: [[]],
};

const CONCRETE_COMMAND_STATE: readonly Member[] = [{ text: 'state' }];
const CONCRETE_COMMAND_METHODS: readonly Member[] = [{ text: 'execute()' }];

const CONCRETE_COMMAND: ClassSpec = {
  x: 400,
  y: 170,
  width: 150,
  name: 'ConcreteCommand',
  compartments: [CONCRETE_COMMAND_STATE, CONCRETE_COMMAND_METHODS],
};

const CLASSES = [CALLER, COMMAND, RECEIVER, CLIENT, CONCRETE_COMMAND];

const EXECUTE_ROW_Y =
  CONCRETE_COMMAND.y +
  HEADER_HEIGHT +
  compartmentHeight(CONCRETE_COMMAND_STATE) +
  compartmentHeight(CONCRETE_COMMAND_METHODS) / 2;

const IMPLEMENTATION_NOTE = {
  x: 600,
  width: 160,
  height: 32,
};

function right(spec: ClassSpec) {
  return spec.x + spec.width;
}

function bottom(spec: ClassSpec) {
  return spec.y + classHeight(spec);
}

function centerX(spec: ClassSpec) {
  return spec.x + spec.width / 2;
}

function Edge({
  d,
  start,
  end,
  dashed = false,
}: {
  d: string;
  start?: 'diamond';
  end?: 'open' | 'hollowTriangle';
  dashed?: boolean;
}) {
  return (
    <path
      d={d}
      fill='none'
      stroke='currentColor'
      strokeDasharray={dashed ? '4 4' : undefined}
      markerStart={start ? markerUrl(MARKER_PREFIX, start) : undefined}
      markerEnd={end ? markerUrl(MARKER_PREFIX, end) : undefined}
    />
  );
}

export default function UmlClassDiagram() {
  const callerToCommandY = CALLER.y + 36;
  const receiverY = RECEIVER.y + 44;
  const clientToConcreteY = CLIENT.y + 42;

  return (
    <figure className='my-8'>
      <svg
        viewBox='0 0 770 264'
        role='img'
        aria-label='UML class diagram of the Command pattern: Caller holds a Command; ConcreteCommand implements Command, keeps state and calls Receiver.action() from execute(); Client uses Receiver and ConcreteCommand.'
        className={`${SVG_CLASSES} max-w-[770px]`}
      >
        <UmlMarkers prefix={MARKER_PREFIX} />
        <g
          fontFamily='var(--font-mono)'
          fontSize={FONT_SIZE}
          strokeWidth={1.25}
        >
          <Edge
            d={`M${right(CALLER)},${callerToCommandY} H${COMMAND.x}`}
            start='diamond'
            end='open'
          />
          <Edge
            d={`M${centerX(CONCRETE_COMMAND)},${CONCRETE_COMMAND.y} V${bottom(COMMAND)}`}
            end='hollowTriangle'
          />
          <Edge
            d={`M${CONCRETE_COMMAND.x},${receiverY} H${right(RECEIVER)}`}
            end='open'
          />
          <Edge
            d={`M${right(CLIENT)},${receiverY} H${RECEIVER.x}`}
            end='open'
          />
          <Edge
            d={`M${right(CLIENT)},${clientToConcreteY} H${CONCRETE_COMMAND.x}`}
            end='open'
          />
          <Edge
            d={`M${right(CONCRETE_COMMAND)},${EXECUTE_ROW_Y} H${IMPLEMENTATION_NOTE.x}`}
            dashed
          />

          {CLASSES.map((spec) => (
            <ClassBox key={spec.name} spec={spec} />
          ))}

          <circle
            cx={right(CONCRETE_COMMAND)}
            cy={EXECUTE_ROW_Y}
            r={3}
            className={BOX_CLASSES}
            stroke='currentColor'
          />
          <UmlNote x={10} y={10} width={130} height={36} text='Notation: UML' />
          <UmlNote
            x={IMPLEMENTATION_NOTE.x}
            y={EXECUTE_ROW_Y - IMPLEMENTATION_NOTE.height / 2}
            width={IMPLEMENTATION_NOTE.width}
            height={IMPLEMENTATION_NOTE.height}
            text='receiver.action()'
          />
        </g>
      </svg>
    </figure>
  );
}
