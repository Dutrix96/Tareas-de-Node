import { http, withToken } from "./http.js";

export const gqlRequest = async (token, query, variables = {}) => {
  const { data } = await http.post(
    "/graphql",
    { query, variables },
    withToken(token)
  );

  if (data.errors?.length) {
    throw new Error(data.errors[0].message || "Error GraphQL");
  }

  return data.data;
};

export const Q_TAREAS_POR_DIFICULTAD = `
  query($dificultad: String!) {
    tareasPorDificultad(dificultad: $dificultad) {
      id
      descripcion
      duracion
      dificultad
      estado
    }
  }
`;

export const Q_TAREAS_SIN_ASIGNAR_ORD = `
  query {
    tareasSinAsignarOrdenadas {
      id
      descripcion
      duracion
      dificultad
      estado
    }
  }
`;

export const Q_NUM_XL = `
  query {
    numeroTareasMaximaDificultad
  }
`;