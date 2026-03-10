import { IconType } from 'react-icons';
import { BiLogoPostgresql } from 'react-icons/bi';
import { FaAws, FaChalkboardTeacher } from 'react-icons/fa';
import { GoDatabase, GoGoal, GoServer } from 'react-icons/go';
import { HiUserGroup } from 'react-icons/hi';
import { LuChartGantt } from 'react-icons/lu';
import { MdAutoMode, MdHttp } from 'react-icons/md';
import {
  SiApachekafka,
  SiAwslambda,
  SiC,
  SiClickhouse,
  SiCplusplus,
  SiDelphi,
  SiDocker,
  SiElasticsearch,
  SiElm,
  SiErlang,
  SiGit,
  SiGo,
  SiGrafana,
  SiJavascript,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiMqtt,
  SiMysql,
  SiOpenjdk,
  SiOracle,
  SiPhp,
  SiPrometheus,
  SiPython,
  SiRedis,
  SiScala,
  SiServerless,
  SiSnowflake,
  SiSqlite,
  SiTerraform,
  SiTypescript,
} from 'react-icons/si';
import { TbApi, TbBrandCSharp } from 'react-icons/tb';
import { TfiDirectionAlt } from 'react-icons/tfi';

import { Lang } from '../index';

type ServiceIcon = { icon: IconType; title: string };

const services = {
  interimCTO: {
    title: {
      en: 'Interim / Fractional CTO',
      uk: 'Тимчасовий CTO',
    },
    proposition: {
      en: 'Short, measurable engagements for teams under 35: design roadmaps & technical strategies, ship MVPs, fix production hot paths, step in to lead during transitions, hire senior engineers, and leave you with runnable ops and ownership.',
      uk: 'Обмежені завдання з командами до 35 осіб: планування і архітектура, запуск MVP, вирішення проблем маштабування, підтримка існуючих команд під час зміни керівництва, найм інженерів. Я лишаю вас із самостійними командами і налагодженими бізнес-процесами.',
    },
    icons: {
      lvl1: [
        { icon: TfiDirectionAlt, title: 'Leadership' },
        { icon: LuChartGantt, title: 'Roadmap' },
        { icon: HiUserGroup, title: 'Hiring' },
      ] as ServiceIcon[],
      lvl2: [
        { icon: MdAutoMode, title: 'Automation' },
        { icon: GoServer, title: 'Infrastructure' },
        { icon: FaChalkboardTeacher, title: 'Mentoring' },
        { icon: GoGoal, title: 'OKR' },
      ] as ServiceIcon[],
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
        { icon: SiC, title: 'C' },
        { icon: SiCplusplus, title: 'C++' },
        { icon: SiGo, title: 'Go' },
        { icon: SiPython, title: 'Python' },
        { icon: SiJavascript, title: 'JavaScript' },
        { icon: SiTypescript, title: 'TypeScript' },
      ] as ServiceIcon[],
      lvl2: [
        { icon: SiOpenjdk, title: 'Java' },
        { icon: SiScala, title: 'Scala' },
        { icon: TbBrandCSharp, title: 'C#' },
      ] as ServiceIcon[],
      lvl3: [
        { icon: SiPhp, title: 'PHP' },
        { icon: SiDelphi, title: 'Delphi' },
        { icon: SiErlang, title: 'Erlang' },
        { icon: SiElm, title: 'Elm' },
      ] as ServiceIcon[],
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
        { icon: FaAws, title: 'AWS' },
        { icon: SiKubernetes, title: 'K8s' },
        { icon: SiTerraform, title: 'Terraform' },
        { icon: SiDocker, title: 'Docker' },
        { icon: SiLinux, title: 'Linux' },
        { icon: SiServerless, title: 'Serverless' },
      ] as ServiceIcon[],
      lvl2: [
        { icon: SiAwslambda, title: 'Lambda' },
        { icon: SiPrometheus, title: 'Prometheus' },
        { icon: SiGrafana, title: 'Grafana' },
        { icon: SiElasticsearch, title: 'ELK' },
      ] as ServiceIcon[],
      lvl3: [
        { icon: SiGit, title: 'Git' },
        { icon: MdHttp, title: 'HTTP' },
        { icon: TbApi, title: 'RESTful' },
      ] as ServiceIcon[],
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
        { icon: BiLogoPostgresql, title: 'PostgreSQL' },
        { icon: SiMysql, title: 'MySQL' },
        { icon: SiOracle, title: 'Oracle' },
        { icon: GoDatabase, title: 'Microsoft SQL Server' },
      ] as ServiceIcon[],
      lvl2: [
        { icon: SiApachekafka, title: 'Kafka' },
        { icon: SiRedis, title: 'Redis' },
        { icon: SiMqtt, title: 'MQTT' },
      ] as ServiceIcon[],
      lvl3: [
        { icon: SiMongodb, title: 'MongoDB' },
        { icon: SiSqlite, title: 'SQLite' },
        { icon: SiClickhouse, title: 'ClickHouse' },
        { icon: SiSnowflake, title: 'Snowflake' },
      ] as ServiceIcon[],
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
