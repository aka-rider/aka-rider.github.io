import { Lang } from '../index';

const services = {
  interimCTO: {
    title: {
      en: 'Interim / Fractional CTO',
      uk: 'Тимчасовий CTO',
    },
    proposition: {
      en: 'Short, measurable engagements for teams under 35: ship MVPs, fix production hot paths, hire senior engineers, and leave you with runnable ops and ownership.',
      uk: 'Обмежені завдання з командами до 35 осіб: випуск MVP, налаштування продакшн середовищ, найм інженерів, автоматизація вашого бізнесу.',
    },
    icons: {
      lvl1: [
        { icon: 'TfiDirectionAlt', title: 'Leadership' },
        { icon: 'LuChartGantt', title: 'Strategy' },
        { icon: 'HiUserGroup', title: 'Hiring' },
      ],
      lvl2: [
        { icon: 'MdAutoMode', title: 'Automation' },
        { icon: 'GoServer', title: 'Infrastructure' },
        { icon: 'FaChalkboardTeacher', title: 'Mentoring' },
        { icon: 'GoGoal', title: 'OKR' },
      ],
    },
  },
  programming: {
    title: {
      en: 'Programming',
      uk: 'Програмування',
    },
    proposition: {
      en: 'Architecture design and code writing, complex refactoring, developer team mentoring, and technical consulting services.',
      uk: 'Розробка архітектури та написання коду, складний рефакторинг, менторинг команди розробників та технічне консультування.',
    },
    icons: {
      lvl1: [
        { icon: 'SiC', title: 'C' },
        { icon: 'SiCplusplus', title: 'C++' },
        { icon: 'SiGo', title: 'Go' },
        { icon: 'SiPython', title: 'Python' },
        { icon: 'SiJavascript', title: 'JavaScript' },
        { icon: 'SiTypescript', title: 'TypeScript' },
      ],
      lvl2: [
        { icon: 'SiOpenjdk', title: 'Java' },
        { icon: 'SiScala', title: 'Scala' },
        { icon: 'TbBrandCSharp', title: 'C#' },
      ],
      lvl3: [
        { icon: 'SiPhp', title: 'PHP' },
        { icon: 'SiDelphi', title: 'Delphi' },
        { icon: 'SiErlang', title: 'Erlang' },
        { icon: 'SiElm', title: 'Elm' },
      ],
    },
  },
  deployment: {
    title: {
      en: 'Infra & DevOps',
      uk: 'Інфраструктура та DevOps',
    },
    proposition: {
      en: 'DevOps services, infrastructure-as-code, platform monitoring, and observability setup for reliable operations. CI/CD.',
      uk: 'Послуги DevOps, інфраструктура-як-код, налаштування моніторингу ефективності та надійності платформ. CI/CD.',
    },
    icons: {
      lvl1: [
        { icon: 'FaAws', title: 'AWS' },
        { icon: 'SiKubernetes', title: 'Kubernetes' },
        { icon: 'SiTerraform', title: 'Terraform' },
        { icon: 'SiDocker', title: 'Docker' },
        { icon: 'SiLinux', title: 'Linux' },
        { icon: 'SiServerless', title: 'Serverless' },
      ],
      lvl2: [
        { icon: 'SiAwslambda', title: 'Lambda' },
        { icon: 'SiPrometheus', title: 'Prometheus' },
        { icon: 'SiGrafana', title: 'Grafana' },
      ],
      lvl3: [
        { icon: 'SiGit', title: 'Git' },
        { icon: 'MdHttp', title: 'HTTP' },
        { icon: 'TbApi', title: 'RESTful' },
      ],
    },
  },
  dataStorage: {
    title: {
      en: 'Data & Backends',
      uk: 'DBA, бази даних',
    },
    proposition: {
      en: 'DBA services, database consulting, datalakes and analytic platforms.',
      uk: 'послуги DBA, консультування з баз даних, побудова платформ для аналітики.',
    },
    icons: {
      lvl1: [
        { icon: 'BiLogoPostgresql', title: 'PostgreSQL' },
        { icon: 'SiMysql', title: 'MySQL' },
        { icon: 'SiOracle', title: 'Oracle' },
        { icon: 'SiElasticsearch', title: 'Elasticsearch' },
        { icon: 'SiApachekafka', title: 'Kafka' },
      ],
      lvl2: [
        { icon: 'GoDatabase', title: 'Microsoft SQL Server' },
        { icon: 'SiRedis', title: 'Redis' },
        { icon: 'SiMqtt', title: 'MQTT' },
      ],
      lvl3: [
        { icon: 'SiMongodb', title: 'MongoDB' },
        { icon: 'SiSqlite', title: 'SQLite' },
        { icon: 'SiClickhouse', title: 'ClickHouse' },
        { icon: 'SiSnowflake', title: 'Snowflake' },
      ],
    },
  },
} as const;

// Helper function to transform services for a specific language
export function translateServices(lang: Lang) {
  return {
    interimCTO: {
      title: services.interimCTO.title[lang],
      proposition: services.interimCTO.proposition[lang],
      icons: services.interimCTO.icons,
    },
    programming: {
      title: services.programming.title[lang],
      proposition: services.programming.proposition[lang],
      icons: services.programming.icons,
    },
    deployment: {
      title: services.deployment.title[lang],
      proposition: services.deployment.proposition[lang],
      icons: services.deployment.icons,
    },
    dataStorage: {
      title: services.dataStorage.title[lang],
      proposition: services.dataStorage.proposition[lang],
      icons: services.dataStorage.icons,
    },
  };
}

export type ServicesContent = ReturnType<typeof translateServices>[keyof ReturnType<typeof translateServices>];
