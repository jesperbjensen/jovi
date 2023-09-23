import { PageProps } from "..";
import Layout from "../components/Layout";

export default function IndexPage(props: PageProps) {
  return (
    <Layout>
      <h1>Hello</h1>

      {props.cookies.loggedIn === "true" ? (
        <div>
          <h2>Admin</h2>
          <p>Here is the secret admin page</p>
        </div>
      ) : (
        <div>
          <h2>Not admin</h2>
          <p>You are not logged in as admin</p>
        </div>
      )}

      <h2>Login</h2>
      <form action="/login" method="POST">
        <label>
          Username
          <input type="text" name="username" />
        </label>
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <button type="submit">Login</button>
      </form>

      <div id="counter"></div>
      <script type="module" dangerouslySetInnerHTML={{__html: `
        import { Counter } from "./js/counter.js"
        import { mount } from "./js/mount.js"
        mount(Counter, {}, "counter")
      `}}>

      </script>
    </Layout>
  );
}
