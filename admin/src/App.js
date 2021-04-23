import { Route,Redirect,Switch } from 'react-router-dom';
import Login from './pages/Login';
import AdminIndex from './pages/AdminIndex';
import Other from './pages/Other'


function App() {
  return (
    
    <Switch>
      <Route path='/login' component={Login}/>
      <Route path="/" exact component={AdminIndex} />
      <Route path="/home"  component={AdminIndex} />

      <Route component={Other}/>
      
    </Switch>
  );
}

export default App;
