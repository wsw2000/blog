import { Route,Redirect,Switch } from 'react-router-dom';
import Login from './pages/Login';
import AdminIndex from './pages/AdminIndex';
import Other from './pages/Other'


function App() {
  return (
    
    <Switch>
      <Route path='/login' exact component={Login}/>
      <Route path="/home"  component={AdminIndex} />
      <Route path="/"  component={AdminIndex} />
      {/* <Redirect to="/home"/> */}
      <Route path="*" component={Other}></Route>
      
    </Switch>
  );
}

export default App;
