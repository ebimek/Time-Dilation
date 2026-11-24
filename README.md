# Special Relativity Interactive Simulator

An interactive web-based physics simulator that visualizes and calculates the core effects of Einstein's Special Theory of Relativity in real time.

## Features

- **Side-by-Side Frame Comparison:**
  - **Time Dilation Stopwatches:** Animated analog dials comparing elapsed time in the stationary frame against the slower-ticking moving frame.
  - **Length Contraction Bars:** Visual comparison of rest length ($L_0$) versus contracted length ($L = L_0 / \gamma$).
  - **Light-Clock Photon Paths:** Animated photon bounce showing vertical vs. diagonal light paths.
- **Interactive Controls:**
  - Relative velocity slider ($v/c$ from `0.000c` to `0.999c`).
  - Stepper inputs (`−` / `+`) for **Proper Time ($\Delta t_0$)**, **Rest Length ($L_0$)**, and **Rest Mass ($m_0$)**.
  - Play/Pause toggle to freeze the simulation at any moment.
- **Real-Time Calculations:**
  - **Lorentz Factor:** $\gamma = \frac{1}{\sqrt{1 - v^2/c^2}}$
  - **Dilated Time:** $\Delta t = \gamma \Delta t_0$
  - **Contracted Length:** $L = \frac{L_0}{\gamma}$
  - **Relativistic Momentum:** $p = \gamma m_0 v$
  - **Kinetic Energy:** $K = (\gamma - 1) m_0 c^2$
  - **Total Energy:** $E = \gamma m_0 c^2$
