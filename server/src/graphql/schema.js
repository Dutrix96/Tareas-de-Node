//para agilizar esto es del gpt
export const typeDefs = `#graphql
  type Usuario {
    id: ID!
    nombre: String!
    email: String!
    rol: String!
  }

  type Tarea {
    id: ID!
    descripcion: String!
    duracion: Float!
    dificultad: String!
    estado: String!
    asignadaA: Usuario
    creadaPor: Usuario
    createdAt: String
    updatedAt: String
  }

  type ResumenUsuario {
    total: Int!
    porHacer: Int!
    haciendo: Int!
    hecha: Int!
  }

  type Query {
    # Enunciado:
    tareasPorDificultad(dificultad: String!): [Tarea!]!
    tareasPorRangoDificultad(min: String!, max: String!): [Tarea!]!
    numeroTareasMaximaDificultad: Int!
    tareasDeUsuario(usuarioId: ID!): [Tarea!]!
    tareasDeUsuarioPorDificultad(usuarioId: ID!, dificultad: String!): [Tarea!]!
    tareasSinAsignarOrdenadas: [Tarea!]!

    # Consulta extra util:
    resumenTareasUsuario(usuarioId: ID!): ResumenUsuario!
  }
`;