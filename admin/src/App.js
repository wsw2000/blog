import { BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import Login from './pages/Login';
import AdminIndex from './pages/AdminIndex';


function App() {
  return (
    <Switch>
      <Route path='/login' exact component={Login}/>
      <Route path="/home"  component={AdminIndex} />
      <Redirect to="/home/word"/>
    </Switch>
  );
}

export default App;
