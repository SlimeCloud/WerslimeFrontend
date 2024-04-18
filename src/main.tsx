import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";

import './index.css'

document.title = import.meta.env._TITLE

ReactDOM.createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<App/>
	</BrowserRouter>
)
