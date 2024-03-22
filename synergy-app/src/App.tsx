import { useRoutes } from "react-router-dom";
import "./routes/Routes";
import routes from "./routes/Routes";

function App() {
  const content = useRoutes(routes);

  return content;
}

export default App;
