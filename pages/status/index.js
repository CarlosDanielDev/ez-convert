import useSWR from "swr";

const fetchAPI = async (key) => {
  const res = await fetch(key);
  return res.json();
};

function useStatus() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  return {
    data,
    isLoading,
  };
}

const LOADING_TEXT = "Loading...";

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { data, isLoading } = useStatus();

  const getValue = (value) =>
    !isLoading && value !== undefined ? value : LOADING_TEXT;

  return (
    <div>
      Last update:{" "}
      {getValue(
        data?.updated_at
          ? new Date(data.updated_at).toLocaleString("pt-BR")
          : undefined,
      )}
      <br />
    </div>
  );
}

function DatabaseStatus() {
  const { data, isLoading } = useStatus();
  const db = data?.dependencies?.database;

  const getValue = (value) =>
    !isLoading && value !== undefined ? value : LOADING_TEXT;

  return (
    <div>
      <h2>Database</h2>
      <br />
      Database version: {getValue(db?.version)}
      <br />
      Max connections: {getValue(db?.max_connections)}
      <br />
      Opened connections: {getValue(db?.opened_connections)}
    </div>
  );
}
