import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Segment,
  Form,
  Button,
  Header,
  Input,
  Icon,
  Grid,
  Message
} from "semantic-ui-react";
import api, { setAuthToken } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [toke, setToke] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { username, password });
      console.log("response", response);
      const token = response.data.access_token;
      login(token);
      setAuthToken(token);
      setToke(token);
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    } catch (error) {
      setErrorMessage("Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  console.log("toke", toke);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        backgroundColor: "#f5f5f5"
      }}
    >
      {errorMessage && (
        <Message
          negative
          style={{
            width: "50%",
            fontSize: "1.05em",
            textAlign: "center",
            color: "black"
          }}
          onDismiss={() => setErrorMessage("")}
          header="Login Failed"
          content={errorMessage}
        />
      )}

      <Segment
        padded
        raised
        style={{
          width: "60vw",
          padding: "5%",
          backgroundColor: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          borderRadius: "10px"
        }}
      >
        <Grid centered>
          <Grid.Row
            columns={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Grid.Column>
              <img
                src="/images.jpeg"
                alt="Univesity Logo"
                style={{ width: "100%" }}
              />
            </Grid.Column>

            <Grid.Column>
              <Header
                as="h1"
                style={{
                  marginBottom: "40px",
                  fontFamily: "Kanit, sans-serif",
                  fontWeight: 500,
                  fontSize: "2.3em",
                  textAlign: "center"
                }}
              >
                Welcome to <span style={{ color: "red" }}>Kelani</span>{" "}
                <span style={{ color: "green" }}>Edu</span>
              </Header>
              <Form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "5px" }}>
                  <Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      borderRadius: "5px"
                    }}
                  />
                </div>
                <div style={{ marginBottom: "25px" }}>
                  <Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    style={{
                      borderRadius: "5px"
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    color="blue"
                    style={{
                      width: "45%",
                      borderRadius: "5px",
                      fontWeight: "bold"
                    }}
                    type="submit"
                    loading={isLoading}
                  >
                    Login
                  </Button>
                  <Button
                    color="green"
                    style={{
                      width: "45%",
                      borderRadius: "5px",
                      fontWeight: "bold"
                    }}
                    onClick={() =>
                      setErrorMessage("Password reset feature coming soon")
                    }
                  >
                    Reset Password
                  </Button>
                </div>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};

export default Login;
