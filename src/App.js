import logo from './logo.svg';
import './App.css';

function App() {
  return (
     <div>
      <h1>Fragments UI</h1>
      <section>
        <nav>
          <button>Login</button>
        </nav>
      </section>
        <section id="user">
          <h2>
            Hello <span className="username"></span>!
          </h2>
        </section>
    </div>
  );
}

export default App;
