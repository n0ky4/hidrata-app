# hidrata-app v1.0 — Especificações

Este arquivo serve como um norte para o desenvolvimento do hidrata-app.

## 1. Introdução

O `hidrata-app` (estilizado em minúsculas e com hífen) é uma aplicação web que tem como objetivo auxiliar o usuário a manter-se hidratado ao longo do dia.

A princípio, o `hidrata-app` será apenas uma aplicação local, sem back-end. Futuramente, será desenvolvido um back-end para armazenar os dados do usuário, compartilhar estatísticas e sincronizar entre dispositivos. (talvez na versão 2.0)

O `hidrata-app` será open-source, licenciado sob a AGPL-3.0.

## 2. Funcionalidades

### 2.1. Consumo ideal de água

A aplicação irá calcular a quantidade diária ideal de água de acordo com a idade, peso e condições climáticas do local do usuário, que serão detectadas automaticamente através de uma API.

#### Cálculo:

O consumo ideal de água é calculado somando a constante base (que depende da idade, em mL/kg) ao coeficiente das condições climáticas atuais, e multiplicando pelo peso da pessoa, em kg.

```math
\text{Consumo de Água Ideal} = (\text{CB} + \text{K}) \times \text{Peso}
```

#### Condições:

| Idade        | Constante Base (CB) |
| ------------ | ------------------- |
| ≤ 17 anos    | 40 mL/kg            |
| 18 a 55 anos | 35 mL/kg            |
| 55 a 65 anos | 30 mL/kg            |
| ≥ 66 anos    | 25 mL/kg            |

#### Coeficiente Climático (K)

-   Clima Favorável: $\text{K} = 0$
-   Onda de Calor: $\text{K} = 10$

#### Fontes

[Agência de Nutrição do Distrito Federal (ANDF)](http://www.andf.com.br/noticias/agua-descubra-o-que-ela-tem-de-tao-especial-e-porque-e-fundamental-preserva-la)

[g1 Saúde](https://g1.globo.com/saude/noticia/2025/02/18/calculadora-da-agua-20-descubra-quanto-voce-precisa-beber-por-dia-em-epoca-de-ondas-de-calor.ghtml)

### 2.2. Registro de consumo de água

O usuário poderá registrar a quantidade de água que consumiu em um determinado tempo, o que mostrará a porcentagem faltante para completar a meta diária.

O usuário também poderá criar containers personalizados (ex.: garrafas, copos, squeezes) para facilitar o registro, ou inserir manualmente a quantidade de água.

### 2.3. Lembretes

O usuário poderá ativar os lembretes, que funcionarão através de notificações no desktop.

O tempo dos lembretes será de escolha do usuário.

Para a eficiência dos lembretes, a aplicação utilizará **Web Workers** para rodar o intervalo de tempo em segundo plano, prevenindo interrupções por parte do navegador, como a suspensão de abas inativas.

### 2.4. Estatísticas

O usuário poderá ver suas estatísticas de consumo de água.

#### Tipos de Estatísticas:

-   **Gráfico de Linha**: O gráfico de linha mostrará a quantidade de água ingerida durante um certo intervalo de tempo (semana, mês, ano).

-   **Gráfico de Barra**: O gráfico de barra mostrará uma relação (semanal, mensal ou anual) entre quantidade de água ingerida e quantidade de água ideal.

-   **Calendar Heatmap**: O calendar heatmap (semelhante ao gráfico de contribuições do GitHub) mostrará uma relação entre dia e quantidade de água ingerida, o que possibilita a visualização dos dias em que o usuário mais consumiu água.

-   **Histórico**: O histórico mostrará a quantidade de água ingerida em cada dia, com a possibilidade de ver detalhes (insights) de cada dia.

**Insights**:

-   **Meta**: Quantidade ideal de água (nas configurações daquela data)
-   **Consumido**: Quantidade de água ingerida
-   **Faltante/Excedente**: Quantidade de água faltante ou excedente em relação à meta
-   **Condições Climáticas**: Condições climáticas do dia
-   **Quantidade de registros**: Quantidade de registros de água naquele dia
-   **Horários**: Horários em que a água foi ingerida
-   **Intervalo médio entre cada registro**: Intervalo de tempo médio entre cada registro de água. (ex.: Você ingeriu água a cada 30 minutos [em média])

### 2.5. Configurações

O usuário poderá configurar a aplicação de acordo com suas preferências.

#### Peso e Idade

O usuário poderá alterar seu peso e idade posteriormente.

#### Notificações

-   **Estado**: Ativar/Desativar notificações
-   **Intervalo de tempo**: Intervalo entre as notificações (ex.: 20 minutos, 1 hora, etc...)
-   **Som**: Selecionar dentre os sons disponíveis

#### Unidades de medida

Será possível escolher entre as unidades de medida métricas (mL, kg) e imperiais (fl oz, lb).

Por questões de precisão e configuração posterior, a aplicação (por baixo dos panos) sempre utilizará as unidades métricas. A conversão para unidades imperiais será feita apenas na interface.

#### Idioma

Será possível escolher entre os idiomas disponíveis. (Inicialmente, português e inglês)

#### Tema

Será possível escolher e personalizar temas.

-   **Temas**: Claro, Escuro, Sistema, Automático (de acordo com o horário)
-   **Cor de destaque**: Cor de acentuação escolhida pelo usuário
-   **Fontes**: Fontes pré-definidas

### 2.6 Exportar Dados

O usuário poderá exportar seus dados (em formato cru) em JSON ou CSV.

O usuário também poderá exportar um relatório em HTML ou PDF, para análise pessoal ou médica.

### 2.7 Importar Dados

O usuário poderá importar seus dados (em formato cru) em JSON ou CSV.

## 3. Tecnologias

### 3.1. PWA

O `hidrata-app` será um Progressive Web App, o que possibilitará o uso offline e a instalação no dispositivo.

### 3.2. Responsividade

O `hidrata-app` será responsivo, o que possibilitará o uso em dispositivos móveis.

### 3.3. Stack

O `hidrata-app` será desenvolvido com TypeScript.

-   **Framework**: React.js (Vite)
-   **Gerenciamento de Estado**: Zustand
-   **Gerenciamento de Formulários**: React Hook Form
-   **Estilização**: Tailwind CSS
-   **Schemas**: Zod
-   **Gráficos**: Chart.js
-   **Testes**: Jest, React Testing Library

## 4. Esquematização

A esquematização serve para organizar as informações e estruturar o desenvolvimento.

### 4.1. Estados

### 4.2. Configurações

As configurações deverão ser armazenadas no `localStorage` com os seguintes itens:

#### 4.2.1. `config`

```json
{
    "version": "1.0", // versão do arquivo de configuração, para futuras atualizações
    "language": "pt",
    "notifications": {
        "enabled": true,
        "interval": 20, // minutos
        "sound": "default"
    },
    "units": {
        "weight": "kg",
        "volume": "ml"
    },
    "theme": {
        "mode": "auto",
        "accentColor": "#2563EB",
        "font": "Inter"
    },
    "age": 25,
    "weight": 70,
    "weather": {
        "enabled": true, // Se o app usará o coeficiente climático
        "latitude": -15.7801,
        "longitude": -47.9292
    }
}
```

#### 4.2.2. `containers`

```json
{
    "version": "1.0",
    "containers": [
        {
            "id": "<nanoid>",
            "name": "Minha garrafinha",
            "volume": 500 // em mL
        },
        {
            "id": "<nanoid>",
            "name": "Copo da Shopee",
            "volume": 200 // em mL
        }
    ]
}
```

#### 4.2.3. `data`

```json
{
    "version": "1.0",
    "consumption": {
        "history": [
            {
                "date": "2022-10-01",
                "weather": "favorable",
                "goal": 2000,
                "consumed": 1500,
                "records": [
                    {
                        "time": "<Data UTC>",
                        "amount": 500,
                        "container": "<container_id>" // (opcional)
                    },
                    {
                        "time": "<Data UTC>",
                        "amount": 500
                    },
                    {
                        "time": "<Data UTC>",
                        "amount": 500
                    }
                ]
            }
        ]
    }
}
```

### 4.3. Design

O design deve ser minimalista, moderno, intuitivo, responsivo, acessível e _MANEIRO_.

As cores devem ter um alto contraste e devem ser vibrantes.

Uma logo é desejável.

## 5. Planos futuros

-   **Back-end**: Desenvolver um back-end para autenticação, armazenamento dos dados dos usuários, possibilitar o compartilhamento estatísticas e sincronização entre dispositivos.

-   **Gamificação**: Adicionar elementos de gamificação para incentivar o usuário a manter-se hidratado, como conquistas, desafios, badges, ranks, etc...
