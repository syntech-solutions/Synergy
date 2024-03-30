import CallScreen from "./components/CallScreen";
import JoinMeeting from "./components/JoinMeeting";
import VirtualWorkspaceWork from "./components/VirtualWorkspaceWork";

function App() {
  return (
    <>
      <div>
        <CallScreen callID={"xRWq6SDcSeSHUrS5jqvR"} userID={"user1"} />
        {/* <VirtualWorkspaceWork exCanvasRef={null} setCanvasRef={() => {}} /> */}
        {/* <JoinMeeting /> */}
      </div>
    </>
  );
}

export default App;
