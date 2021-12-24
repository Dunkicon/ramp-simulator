import { useCallback, useContext, useEffect, useMemo } from "react";

import { SimOrchestrator } from "components/SimOrchestrator";
import { Card } from "components/Card";
import { SpellSelection } from "components/SpellSelection";
import Header from "components/Header";
import { Button } from "components/Button";

import { v4 } from "uuid";
import { SimulationsContext } from "context/simulations";
import { deleteSimulation, addSimulation } from "context/simulations.actions";
import { createPlayer } from "lib";
import { createInitialState } from "lib/spellQueue";

function App() {
  const { state, dispatch } = useContext(SimulationsContext);

  const deleteSim = useCallback(
    (uuid: string) => {
      dispatch(deleteSimulation(uuid));
    },
    [dispatch]
  );

  const addSim = useCallback(() => {
    const simulationId = v4();
    const player = createPlayer(2000, 990, 350, 350, 400);
    const initialSimState = createInitialState(player);

    dispatch(
      addSimulation({
        guid: simulationId,
        sim: initialSimState,
      })
    );
  }, [dispatch]);

  // Memoize the sim entries and the count
  const [sims, simCount] = useMemo(() => {
    const simEntries = Object.entries(state.simulations);

    return [simEntries, simEntries.length];
  }, [state.simulations]);

  // Creates the initial simulation pane
  useEffect(() => {
    if (simCount !== 0) return;

    addSim();
  }, [simCount, addSim]);

  return (
    <>
      <Header></Header>
      <Card>
        <SpellSelection />
      </Card>
      {sims.map(([id, config]) => (
        <Card key={id}>
          <SimOrchestrator
            deletionAllowed={simCount > 1}
            onDelete={deleteSim}
            simId={id}
            simulationConfiguration={config}
          />
        </Card>
      ))}
      <Button className="mx-auto block mb-4" outline icon="PlusCircleIcon" onClick={addSim}>
        Add Simulation
      </Button>
    </>
  );
}

export default App;
