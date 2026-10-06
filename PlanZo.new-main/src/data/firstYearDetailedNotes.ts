import { SubjectFolderData } from '../types';

export const OFFICIAL_FIRST_YEAR_DRIVE_LINK =
  'https://drive.google.com/drive/folders/1bBaq7KCkfAGYM_weQiApKN2b6vjZw7f4?usp=drive_link';

export interface UnitDetailedNote {
  unitNumber: number;
  unitTitle: string;
  weightage: string;
  summary: string;
  keyFormulas: string[];
  keyConcepts: {
    heading: string;
    description: string;
    bulletPoints?: string[];
  }[];
  derivationsOrTheorems: string[];
  frequentExamQuestions: {
    question: string;
    marks: number;
    answerSummary: string;
  }[];
}

export interface FirstYearSubjectNotesDetail {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  shortDescription: string;
  textbook: string;
  driveFolderUrl: string;
  totalPdfPages: string;
  units: UnitDetailedNote[];
  quickFormulas: { title: string; formula: string; note: string }[];
}

export const FIRST_YEAR_SUBJECT_NOTES_CATALOG: Record<string, FirstYearSubjectNotesDetail> = {
  // 1. APPLIED CHEMISTRY (CH-101)
  'sub-applied-chem': {
    subjectId: 'sub-applied-chem',
    subjectCode: 'CH-101',
    subjectName: 'Applied Chemistry',
    shortDescription:
      'Water technology, hardness calculation, polymers, lubricants, fuels & combustion, phase rule, and corrosion control.',
    textbook: 'Engineering Chemistry by P.C. Jain & Monica Jain / Shashi Chawla',
    driveFolderUrl: OFFICIAL_FIRST_YEAR_DRIVE_LINK,
    totalPdfPages: '142 Pages · Full Unit Notes',
    quickFormulas: [
      {
        title: 'Hardness in CaCO3 Equivalents',
        formula: 'Hardness (mg/L) = [Mass of hardness-causing salt (mg/L) × 100] / [Molecular weight of salt]',
        note: 'Equivalent weight of CaCO3 = 50, Molecular weight = 100.',
      },
      {
        title: 'EDTA Hardness Titration',
        formula: 'Total Hardness = (V_EDTA × Normality of EDTA × 50 × 1000) / (V_WaterSample)',
        note: 'Erichrome Black-T (EBT) indicator forms wine-red complex at pH 9-10; turns steel-blue at endpoint.',
      },
      {
        title: 'Dulong’s Formula for GCV',
        formula: 'HCV/GCV = 1/100 × [8080 C + 34500 (H - O/8) + 2240 S] kcal/kg',
        note: 'LCV = HCV - 0.09 × H × 587 kcal/kg (Latent heat of steam = 587 kcal/kg).',
      },
      {
        title: 'Gibbs Phase Rule',
        formula: 'F = C - P + 2 (Condensed system: F = C - P + 1)',
        note: 'Where F = Degrees of freedom, C = Components, P = Phases.',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit-I: Water Technology & Softening Processes',
        weightage: '20% (14 Marks)',
        summary:
          'Comprehensive treatment of temporary and permanent hardness, EDTA titrations, boiler troubles (sludge, scale, priming, foaming, caustic embrittlement), and external water softening techniques.',
        keyFormulas: [
          'Hardness equivalent = (mg/L of salt × 50) / (Chemical Equivalent Weight of salt)',
          'Carbonate Hardness (Temporary) = Ca(HCO3)2 + Mg(HCO3)2',
          'Non-Carbonate Hardness (Permanent) = CaCl2 + MgSO4 + MgCl2 + CaSO4',
        ],
        keyConcepts: [
          {
            heading: 'Boiler Troubles & Preventative Chemistry',
            description:
              'Scale is a hard, adhering crust (CaSO4, CaCO3, Mg(OH)2) causing thermal inefficiency and boiler tube rupture. Sludge is a loose, slimy precipitate (MgCO3, MgCl2, CaCl2). Caustic embrittlement occurs due to high alkaline concentration in boiler water (NaOH entering hairline cracks, causing intercrystalline cracking).',
            bulletPoints: [
              'Scale prevention: Colloidal conditioning (tannin, agar-agar), Phosphate conditioning (Na3PO4, Na2HPO4), Calgon conditioning (Na2[Na4(PO3)6]).',
              'Caustic embrittlement prevention: Adding sodium sulphate (Na2SO4/NaOH ratio maintenance) or lignins.',
            ],
          },
          {
            heading: 'Ion-Exchange Demineralization Process',
            description:
              'Produces zero-hardness, distilled-grade demineralized water. Water is passed sequentially through a Cation Exchange Resin (R-H) and an Anion Exchange Resin (R-OH).',
            bulletPoints: [
              'Cation Exchange: 2R-H + Ca2+ -> R2-Ca + 2H+ (Regenerated using dilute HCl)',
              'Anion Exchange: R-OH + Cl- -> R-Cl + OH- (Regenerated using dilute NaOH)',
              'Neutralization: H+ + OH- -> H2O',
            ],
          },
        ],
        derivationsOrTheorems: [
          'Derivation of EDTA-metal chelation stoichiometry and pH buffer equilibrium.',
          'Derivation of Zeolite water softening capacity and NaCl regeneration balance.',
        ],
        frequentExamQuestions: [
          {
            question: 'Explain EDTA titration method for determination of total, permanent, and temporary hardness with chemical equations.',
            marks: 7,
            answerSummary:
              'Detail buffer solution (NH4Cl + NH4OH, pH=10), EBT wine-red complex formation with Ca2+/Mg2+, EDTA displacement, and endpoint color change to steel-blue.',
          },
          {
            question: 'Compare Zeolite process and Ion-Exchange demineralization process with diagrams and regeneration reactions.',
            marks: 7,
            answerSummary:
              'Tabulate comparison on residual hardness (Zeolite: 10-15 ppm, Demineralization: 0-2 ppm), cost, raw water turbidity constraints, and acid/base regeneration.',
          },
        ],
      },
      {
        unitNumber: 2,
        unitTitle: 'Unit-II: Polymers, Plastics & Advanced Materials',
        weightage: '20% (14 Marks)',
        summary:
          'Polymerization mechanisms (Addition vs Condensation, Free Radical), Thermoplastics vs Thermosets, synthesis and applications of Bakelite, Nylon-6,6, PMMA, and conducting polymers.',
        keyFormulas: [
          'Degree of Polymerization (DP) = Molecular weight of polymer / Molecular weight of repeating unit',
          'Polyacetylene conducting mechanism: Conjugated alternating single and double bonds with p-doping (I2) or n-doping (Na).',
        ],
        keyConcepts: [
          {
            heading: 'Thermoplastics vs Thermosetting Resins',
            description:
              'Thermoplastics possess linear or branched chains with weak Van der Waals forces, soften reversibly on heating, and can be remolded (PE, PVC, PS). Thermosets have 3D cross-linked networks, set irreversibly on initial heating due to covalent bonding, and char on reheating (Bakelite, Urea-formaldehyde).',
          },
          {
            heading: 'Bakelite (Phenol-Formaldehyde) Synthesis',
            description:
              'Phenol and formaldehyde react in presence of acid or base catalyst to form o- and p-hydroxymethyl phenols, condensing to linear Novolac (acid catalyzed), and cross-linking on heating with hexamethylenetetramine (hexa) into insoluble Bakelite.',
          },
        ],
        derivationsOrTheorems: [
          'Free radical chain addition mechanism: Initiation (benzoyl peroxide), Propagation, and Termination (coupling vs disproportionation).',
        ],
        frequentExamQuestions: [
          {
            question: 'Differentiate between Addition and Condensation Polymerization with two engineering examples of each.',
            marks: 7,
            answerSummary:
              'Contrast monomer criteria (unsaturated vs polyfunctional), by-products (none vs H2O/HCl/NH3), molecular weight growth curve, and examples (PE, PVC vs Nylon-6,6, Bakelite).',
          },
        ],
      },
      {
        unitNumber: 3,
        unitTitle: 'Unit-III: Lubricants & Phase Rule',
        weightage: '20% (14 Marks)',
        summary:
          'Mechanisms of lubrication (hydrodynamic, boundary, extreme pressure), lubricant properties (viscosity index, flash/fire point, cloud/pour point), Gibbs Phase Rule and one/two component systems.',
        keyFormulas: [
          'Gibbs Phase Rule: F = C - P + 2',
          'Reduced Phase Rule (for condensed system with constant pressure): F = C - P + 1',
          'Viscosity Index (VI) = [(L - U) / (L - H)] × 100',
        ],
        keyConcepts: [
          {
            heading: 'Lubrication Mechanisms',
            description:
              '1. Fluid film / Hydrodynamic lubrication: Thick lubricant layer (~1000 Å) completely separates metal surfaces, friction depends solely on oil viscosity. 2. Boundary lubrication: Thin molecular layer adsorbed under high load/low speed. 3. Extreme pressure lubrication: Additives like chlorinated esters or organic sulphur compounds react with metal at high temperature to form solid shearable films (FeCl2/FeS).',
          },
          {
            heading: 'One-Component Water System',
            description:
              'Consists of solid ice, liquid water, and water vapor. Triple point: P=4.58 mm Hg, T=0.0075°C where all 3 phases coexist (F = 1 - 3 + 2 = 0, invariant point). Sublimation curve, vaporization curve, and fusion curve (slopes slightly backward due to water density anomaly).',
          },
        ],
        derivationsOrTheorems: [
          'Thermodynamic derivation of Gibbs Phase Rule using chemical potential equilibrium: μ_i(phase 1) = μ_i(phase 2).',
          'Pattinson’s process for desilverization of lead using Pb-Ag eutectic phase diagram (Eutectic point: 2.6% Ag, 303°C).',
        ],
        frequentExamQuestions: [
          {
            question: 'Draw and explain the phase diagram of water system. What is the significance of the triple point?',
            marks: 7,
            answerSummary:
              'Provide labeled P-T diagram showing sublimation, fusion, and vaporization curves, metastable supercooled curve, degrees of freedom in regions (F=2), on curves (F=1), and triple point (F=0).',
          },
        ],
      },
      {
        unitNumber: 4,
        unitTitle: 'Unit-IV: Fuels & Combustion Calculations',
        weightage: '20% (14 Marks)',
        summary:
          'Solid, liquid, and gaseous fuels, proximate and ultimate analysis of coal, Bomb calorimeter experiment for calorific value, and flue gas analysis using Orsat apparatus.',
        keyFormulas: [
          'GCV from Bomb Calorimeter = [(W + w) × (T2 - T1 + Cooling Correction) - (Acid + Fuse + Cotton corrections)] / Mass of fuel',
          'Theoretical Air Required (kg/kg of fuel) = (100 / 23) × [8/3 C + 8 (H - O/8) + S]',
        ],
        keyConcepts: [
          {
            heading: 'Proximate vs Ultimate Analysis of Coal',
            description:
              'Proximate analysis is empirical: determines Moisture (heated at 105°C), Volatile Matter (925°C in covered crucible), Ash (750°C open), and Fixed Carbon (by difference). Ultimate analysis determines elemental percentages: Carbon & Hydrogen (Liebig combustion tube), Nitrogen (Kjeldahl method), Sulphur (Eschka mixture), and Oxygen.',
          },
          {
            heading: 'Flue Gas Analysis (Orsat Apparatus)',
            description:
              'Measures volumetric percentage of CO2, O2, and CO in exhaust flue gases. Gas is absorbed sequentially in: 1. KOH solution (absorbs CO2), 2. Alkaline Pyrogallol (absorbs O2), 3. Ammoniacal Cuprous Chloride (Cu2Cl2, absorbs CO). Must be performed in strict sequence because pyrogallol also absorbs CO2.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of stoichiometric minimum air required for complete combustion of gaseous and solid hydrocarbons.',
        ],
        frequentExamQuestions: [
          {
            question: 'Describe Bomb Calorimeter construction, working, water equivalent calculation, and formula for HCV.',
            marks: 7,
            answerSummary:
              'Include stainless steel bomb, oxygen inlet at 25-30 atm, Beckmann thermometer (precision 0.01°C), water jacket, and complete correction terms.',
          },
        ],
      },
      {
        unitNumber: 5,
        unitTitle: 'Unit-V: Spectroscopy & Corrosion Control',
        weightage: '20% (14 Marks)',
        summary:
          'UV-Visible and IR spectroscopy fundamentals, Beer-Lambert law, types and mechanism of corrosion (chemical and electrochemical), Pilling-Bedworth rule, and cathodic protection.',
        keyFormulas: [
          'Beer-Lambert Law: A = log10(I0 / I) = ε · c · l',
          'Pilling-Bedworth Ratio = Volume of metal oxide layer formed / Volume of metal consumed (PBR > 1 forms protective layer).',
        ],
        keyConcepts: [
          {
            heading: 'Electrochemical Corrosion (Wet Corrosion)',
            description:
              'Occurs when metal is exposed to conducting liquid or two dissimilar metals are in contact. Anodic reaction is oxidation: M -> M^{n+} + ne^-. Cathodic reaction depends on medium: In acidic medium, hydrogen evolution (2H+ + 2e- -> H2); In neutral/alkaline aerated medium, oxygen absorption (O2 + 2H2O + 4e- -> 4OH-).',
          },
          {
            heading: 'Corrosion Protection Techniques',
            description:
              '1. Sacrificial Anodic Protection: Base metal connected to more electropositive metal (Zn, Mg, Al) which acts as sacrificial anode. 2. Impressed Current Cathodic Protection: External DC source makes base metal cathode, inert anode (graphite/platinum). 3. Galvanizing (Zn coating on Fe) vs Tinning (Sn coating on Fe).',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of Beer-Lambert absorbance relationship from differential calculus dI / I = -k c dx.',
        ],
        frequentExamQuestions: [
          {
            question: 'Explain the mechanism of electrochemical corrosion with hydrogen evolution and oxygen absorption reactions.',
            marks: 7,
            answerSummary:
              'Detail galvanic cell formation, electron flow from anode to cathode, iron rusting cycle leading to hydrated ferric oxide (Fe2O3·xH2O).',
          },
        ],
      },
    ],
  },

  // 2. APPLIED PHYSICS (PH-101)
  'sub-applied-phys': {
    subjectId: 'sub-applied-phys',
    subjectCode: 'PH-101',
    subjectName: 'Applied Physics',
    shortDescription:
      'Quantum mechanics, Schrodinger equations, lasers, fiber optics, semiconductors, Hall effect, superconductivity, and Maxwell equations.',
    textbook: 'Concepts of Modern Physics by Arthur Beiser / Engineering Physics by H.K. Malik',
    driveFolderUrl: OFFICIAL_FIRST_YEAR_DRIVE_LINK,
    totalPdfPages: '158 Pages · Full Unit Notes',
    quickFormulas: [
      {
        title: 'De Broglie Wavelength',
        formula: 'λ = h / p = h / (m v) = h / √(2 m E) = 12.27 / √V Å (for electron)',
        note: 'Where h = Planck constant = 6.626 × 10^-34 J·s, V = accelerating potential in volts.',
      },
      {
        title: 'Schrodinger 1D Particle in a Box Energy Levels',
        formula: 'E_n = (n² h²) / (8 m L²) = (n² π² ħ²) / (2 m L²), where n = 1, 2, 3...',
        note: 'Zero-point energy (ground state n=1) = h² / (8 m L²) ≠ 0 due to Heisenberg uncertainty.',
      },
      {
        title: 'Optical Fiber Numerical Aperture (NA)',
        formula: 'NA = sin(θ_a) = √(n1² - n2²) = n1 √(2 Δ), where Δ = (n1 - n2) / n1',
        note: 'Acceptance angle θ_a = arcsin(√(n1² - n2²)); n1 = core index, n2 = cladding index.',
      },
      {
        title: 'Hall Coefficient (R_H)',
        formula: 'R_H = 1 / (n q) = (V_H · t) / (I · B)',
        note: 'n = charge carrier concentration, t = thickness, V_H = Hall voltage.',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit-I: Quantum Mechanics & Wave Optics',
        weightage: '20% (14 Marks)',
        summary:
          'Wave-particle duality, De Broglie hypothesis, Davisson-Germer experiment, Heisenberg Uncertainty Principle, physical interpretation of wave function Ψ, and time-dependent/independent Schrodinger equations.',
        keyFormulas: [
          'Δx · Δp ≥ ħ / 2 (where ħ = h / 2π)',
          'Time-Independent Schrodinger Equation: d²Ψ/dx² + (2m / ħ²)(E - V)Ψ = 0',
          'Wave function normalization: ∫ |Ψ(x)|² dx = 1 from -∞ to +∞',
        ],
        keyConcepts: [
          {
            heading: 'Physical Interpretation of Wave Function Ψ',
            description:
              'Max Born interpretation: Ψ itself has no direct physical meaning, but |Ψ|² = Ψ* Ψ represents the probability density of finding the particle in a given volume element dV. Boundary conditions: Ψ must be continuous, single-valued, and normalizable everywhere.',
          },
          {
            heading: '1D Infinite Potential Well (Particle in a Box)',
            description:
              'For a particle trapped in a box of width L between x=0 and x=L with infinite potential walls: Wave functions are standing waves Ψ_n(x) = √(2/L) sin(n π x / L). Energy is strictly quantized: E_n ∝ n².',
          },
        ],
        derivationsOrTheorems: [
          'Full derivation of Schrodinger Time-Independent wave equation from classical wave equation and De Broglie relation.',
          'Derivation of eigenvalues E_n and normalized eigenfunctions Ψ_n for 1D potential well.',
        ],
        frequentExamQuestions: [
          {
            question: 'Derive the time-independent Schrodinger wave equation for a free particle and solve for a 1D rigid box.',
            marks: 14,
            answerSummary:
              'State operator equivalents, apply boundary conditions Ψ(0)=0 and Ψ(L)=0, derive quantization condition k = nπ/L, evaluate normalization constant A = √(2/L).',
          },
        ],
      },
      {
        unitNumber: 2,
        unitTitle: 'Unit-II: Lasers & Fiber Optics Communication',
        weightage: '20% (14 Marks)',
        summary:
          'Stimulated absorption, spontaneous emission, stimulated emission, Einstein A and B coefficients, population inversion, He-Ne laser and Ruby laser, optical fiber light guidance, and attenuation mechanisms.',
        keyFormulas: [
          'Einstein coefficients relation: A21 / B21 = (8 π h ν³) / c³',
          'B12 = B21 (Probability of stimulated absorption equals probability of stimulated emission)',
          'V-number (Normalized frequency): V = (2 π a / λ) NA',
        ],
        keyConcepts: [
          {
            heading: 'He-Ne Gas Laser (4-Level Laser)',
            description:
              'Active medium is mixture of Helium and Neon (ratio 10:1). Pumping is electrical discharge. He atoms are excited to metastable states (20.61 eV), transferring resonant energy by collision to Ne atoms (20.66 eV), achieving population inversion between Ne levels. Emits red coherent light at 632.8 nm.',
          },
          {
            heading: 'Total Internal Reflection in Optical Fibers',
            description:
              'Light propagates through core (n1) surrounded by cladding (n2 < n1) via Total Internal Reflection. Condition: angle of incidence inside core must exceed critical angle θ_c = arcsin(n2 / n1).',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of Einstein relation between spontaneous and stimulated emission coefficients using Planck radiation law.',
          'Derivation of Acceptance Angle and Numerical Aperture of a step-index optical fiber.',
        ],
        frequentExamQuestions: [
          {
            question: 'Derive the ratio of Einstein coefficients A and B. What is the necessity of population inversion for lasing action?',
            marks: 7,
            answerSummary:
              'Use Boltzmann thermal distribution, equate transition rates at thermal equilibrium, match with Planck radiation formula to obtain A21/B21 = 8πhν³/c³.',
          },
        ],
      },
      {
        unitNumber: 3,
        unitTitle: 'Unit-III: Semiconductors & Superconductivity',
        weightage: '20% (14 Marks)',
        summary:
          'Intrinsic and extrinsic semiconductors, Fermi-Dirac distribution, carrier concentration, Hall Effect and applications, Superconductivity, Meissner effect, Type-I vs Type-II superconductors, BCS theory basics.',
        keyFormulas: [
          'Hall Voltage: V_H = (I B) / (n q t)',
          'Hall Mobility: μ_H = R_H · σ (where σ is electrical conductivity)',
          'Critical Magnetic Field: H_c(T) = H_c(0) [1 - (T / T_c)²]',
        ],
        keyConcepts: [
          {
            heading: 'Hall Effect & Engineering Applications',
            description:
              'When a current-carrying conductor or semiconductor is placed in a transverse magnetic field, a potential difference (Hall Voltage) is developed across perpendicular edges. Applications: 1. Determine whether semiconductor is n-type or p-type (sign of R_H). 2. Measure carrier concentration n. 3. Measure carrier mobility μ. 4. Measure magnetic field B.',
          },
          {
            heading: 'Meissner Effect & Superconductivity',
            description:
              'When a superconducting material is cooled below critical temperature Tc in a weak magnetic field, it expels all internal magnetic flux lines (B = 0 inside, perfect diamagnetism with susceptibility χ = -1). Type-I superconductors have single critical field Hc; Type-II superconductors have two critical fields Hc1 and Hc2 with vortex mixed state.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of Hall coefficient R_H and Hall voltage formula from Lorentz force equilibrium: q E_H = q v_d B.',
        ],
        frequentExamQuestions: [
          {
            question: 'What is Hall Effect? Derive an expression for Hall coefficient and list 4 major industrial applications.',
            marks: 7,
            answerSummary:
              'Draw 3D semiconductor slab with current I along X, field B along Z, resulting Hall electric field along Y, derive R_H = 1/nq.',
          },
        ],
      },
      {
        unitNumber: 4,
        unitTitle: 'Unit-IV: Electromagnetism & Dielectric Materials',
        weightage: '20% (14 Marks)',
        summary:
          'Gauss law in electrostatics and magnetism, Faraday law, Ampere-Maxwell law, Maxwell four equations in differential and integral forms, Poynting theorem, and dielectric polarization mechanisms.',
        keyFormulas: [
          'Maxwell I: ∇ · D = ρ_v',
          'Maxwell II: ∇ · B = 0',
          'Maxwell III: ∇ × E = -∂B / ∂t',
          'Maxwell IV: ∇ × H = J + ∂D / ∂t (where ∂D/∂t is Maxwell displacement current density)',
          'Poynting Vector: S = E × H (W/m², represents energy flux density)',
        ],
        keyConcepts: [
          {
            heading: 'Maxwell Displacement Current',
            description:
              'Ampere circuital law (∇ × H = J) failed for time-varying fields (taking divergence gave ∇ · J = 0, violating equation of continuity ∇ · J = -∂ρ/∂t). Maxwell introduced displacement current J_D = ∂D/∂t = ε (∂E/∂t), explaining capacitor charging and electromagnetic wave propagation in vacuum.',
          },
          {
            heading: 'Poynting Theorem & Energy Flow',
            description:
              'States that the rate of energy transfer per unit volume in an electromagnetic field equals the rate of work done on charges plus the rate of increase of stored electric and magnetic energy: -∇ · S = J · E + ∂/∂t [1/2 ε E² + 1/2 μ H²].',
          },
        ],
        derivationsOrTheorems: [
          'Step-by-step derivation of Maxwell four equations from fundamental electromagnetic laws.',
          'Derivation of wave equation for transverse electromagnetic waves in free space: ∇²E = μ0 ε0 (∂²E / ∂t²), yielding c = 1 / √(μ0 ε0).',
        ],
        frequentExamQuestions: [
          {
            question: 'Write Maxwell equations in differential form and explain the physical significance of each equation.',
            marks: 7,
            answerSummary:
              'Breakdown Gauss law (electric charges as sources), magnetic monopoles absence, Faraday induction law, and Ampere-Maxwell law with displacement current.',
          },
        ],
      },
      {
        unitNumber: 5,
        unitTitle: 'Unit-V: Nanotechnology & Ultrasonics',
        weightage: '20% (14 Marks)',
        summary:
          'Quantum confinement, 0D (Quantum Dots), 1D (Nanowires), 2D (Graphene), Carbon Nanotubes (CNTs), Top-down vs Bottom-up fabrication, and generation/detection of Ultrasonic waves.',
        keyFormulas: [
          'Fundamental resonant frequency of piezoelectric quartz crystal: f = (p / 2t) √(Y / ρ)',
          'Magnetostriction resonant frequency: f = (1 / 2l) √(Y / ρ)',
        ],
        keyConcepts: [
          {
            heading: 'Quantum Confinement & Nanomaterials',
            description:
              'When material dimensions approach exciton Bohr radius (<100 nm), continuous energy bands split into discrete quantized levels. Surface-to-volume ratio increases dramatically, altering optical bandgap, melting point, and chemical reactivity.',
          },
          {
            heading: 'Piezoelectric Generation of Ultrasonics',
            description:
              'Based on inverse piezoelectric effect: when high-frequency AC voltage is applied across opposite faces of quartz crystal cut perpendicular to X-axis, crystal undergoes mechanical contractions and expansions, generating ultrasonic waves at resonance (>20 kHz up to 500 MHz).',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of resonance condition for quartz crystal vibrating in fundamental and overtone modes.',
        ],
        frequentExamQuestions: [
          {
            question: 'Describe Piezoelectric method for production of ultrasonic waves with circuit diagram and frequency formula.',
            marks: 7,
            answerSummary:
              'Sketch Hartley/tuned collector oscillator coupled to quartz crystal, explain resonance matching, and give industrial applications (NDT, sonar, cleaning).',
          },
        ],
      },
    ],
  },

  // 3. MATHEMATICS (MA-101)
  'sub-maths': {
    subjectId: 'sub-maths',
    subjectCode: 'MA-101',
    subjectName: 'Mathematics',
    shortDescription:
      'Differential calculus, Rolle theorem, Taylor series, Jacobians, partial differentiation, double/triple integrals, Beta-Gamma functions, ODEs, and matrices/eigenvalues.',
    textbook: 'Higher Engineering Mathematics by B.S. Grewal / Advanced Engineering Mathematics by Erwin Kreyszig',
    driveFolderUrl: OFFICIAL_FIRST_YEAR_DRIVE_LINK,
    totalPdfPages: '176 Pages · Complete Handwritten Solved Notes',
    quickFormulas: [
      {
        title: 'Euler Theorem for Homogeneous Functions',
        formula: 'x (∂u/∂x) + y (∂u/∂y) = n · u (where n is the degree of homogeneity)',
        note: 'Second order: x² (∂²u/∂x²) + 2xy (∂²u/∂x∂y) + y² (∂²u/∂y²) = n(n - 1) u.',
      },
      {
        title: 'Beta and Gamma Relation',
        formula: 'B(m, n) = [Γ(m) · Γ(n)] / Γ(m + n), and Γ(1/2) = √π',
        note: 'Trigonometric form: ∫_0^{π/2} sin^{2m-1}θ cos^{2n-1}θ dθ = 1/2 B(m, n) = [Γ(m) Γ(n)] / [2 Γ(m + n)].',
      },
      {
        title: 'Cayley-Hamilton Theorem',
        formula: 'Every square matrix satisfies its own characteristic equation: |A - λI| = 0 ⇒ A^n + c_{n-1} A^{n-1} + ... + c_0 I = 0',
        note: 'Enables computation of A^-1 = -1/c0 [A^{n-1} + c_{n-1} A^{n-2} + ...] and high powers A^k.',
      },
      {
        title: 'Jacobian of Transformation',
        formula: 'J = ∂(u, v) / ∂(x, y) = det([∂u/∂x, ∂u/∂y; ∂v/∂x, ∂v/∂y])',
        note: 'Chain rule: J · J\' = 1. Used for change of variables in double integrals: dx dy = |J| du dv.',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit-I: Differential Calculus & Expansions',
        weightage: '20% (14 Marks)',
        summary:
          'Rolle theorem, Cauchy and Lagrange Mean Value Theorems, Maclaurin and Taylor series expansions of single variable functions, indeterminate forms and L-Hospital rule, curvature and radius of curvature.',
        keyFormulas: [
          'Taylor Series: f(a + h) = f(a) + h f\'(a) + (h²/2!) f\'\'(a) + ... + (h^n/n!) f^(n)(a) + ...',
          'Radius of Curvature in Cartesian coordinates: ρ = [1 + (y\')²]^{3/2} / |y\'\'|',
          'Radius of Curvature in Polar coordinates: ρ = [r² + (dr/dθ)²]^{3/2} / [r² + 2(dr/dθ)² - r(d²r/dθ²)]',
        ],
        keyConcepts: [
          {
            heading: 'Mean Value Theorems',
            description:
              'Rolle Theorem: If f(x) is continuous in [a,b], differentiable in (a,b), and f(a)=f(b), there exists c ∈ (a,b) such that f\'(c)=0. Lagrange MVT relaxes the condition: f\'(c) = [f(b) - f(a)] / (b - a). Cauchy MVT generalizes to two functions: [f\'(c) / g\'(c)] = [f(b) - f(a)] / [g(b) - g(a)].',
          },
        ],
        derivationsOrTheorems: [
          'Geometrical and analytical proof of Lagrange and Cauchy Mean Value Theorems.',
          'Derivation of Cartesian radius of curvature formula using intrinsic equation s = f(ψ).',
        ],
        frequentExamQuestions: [
          {
            question: 'Expand log(1 + sin x) up to x⁴ using Maclaurin series expansion.',
            marks: 7,
            answerSummary:
              'Evaluate successive derivatives at x=0: f(0)=0, f\'(0)=1, f\'\'(0)=-1, f\'\'\'(0)=1, f^(4)(0)=-2, yielding x - x²/2 + x³/6 - x⁴/12.',
          },
        ],
      },
      {
        unitNumber: 2,
        unitTitle: 'Unit-II: Partial Differentiation & Multivariable Calculus',
        weightage: '20% (14 Marks)',
        summary:
          'Partial derivatives, Euler theorem for homogeneous functions and deductions, Jacobians, Taylor series for two variables, maxima and minima of functions of two variables, and Lagrange method of undetermined multipliers.',
        keyFormulas: [
          'Saddle Point / Maxima Minima test: r = ∂²f/∂x², s = ∂²f/∂x∂y, t = ∂²f/∂y²',
          'Condition: If rt - s² > 0 and r < 0 ⇒ Local Maximum; If rt - s² > 0 and r > 0 ⇒ Local Minimum; If rt - s² < 0 ⇒ Saddle point.',
        ],
        keyConcepts: [
          {
            heading: 'Lagrange Multipliers Method',
            description:
              'Used to find stationary values of f(x, y, z) subject to constraint φ(x, y, z) = 0. Construct auxiliary function F(x, y, z, λ) = f(x, y, z) + λ φ(x, y, z) and solve system of equations: ∂F/∂x = 0, ∂F/∂y = 0, ∂F/∂z = 0, ∂F/∂λ = 0.',
          },
        ],
        derivationsOrTheorems: [
          'Proof of Euler Theorem for homogeneous function of two variables u = f(x, y) of degree n.',
        ],
        frequentExamQuestions: [
          {
            question: 'Find the dimensions of a rectangular box open at the top of maximum volume for a given surface area S.',
            marks: 7,
            answerSummary:
              'Maximize V = xyz subject to xy + 2yz + 2zx = S using Lagrange multipliers; prove optimal dimensions x = 2z, y = 2z, z = √(S/12).',
          },
        ],
      },
      {
        unitNumber: 3,
        unitTitle: 'Unit-III: Integral Calculus & Special Functions',
        weightage: '20% (14 Marks)',
        summary:
          'Definite integrals, Beta and Gamma functions and inter-relations, Dirichlet integral, Double and Triple integrals, evaluation of area and volume by double integration, change of order of integration.',
        keyFormulas: [
          'Dirichlet Integral for volume: ∭ x^{l-1} y^{m-1} z^{n-1} dx dy dz = [Γ(l) Γ(m) Γ(n)] / Γ(l + m + n + 1)',
          'Double integral in polar coordinates: ∬ f(r, θ) r dr dθ',
        ],
        keyConcepts: [
          {
            heading: 'Change of Order of Integration',
            description:
              'Transforms an integral where vertical strips are used (dy first, then dx) into horizontal strips (dx first, then dy). Requires sketching the boundary curves, identifying intersection points, and rewriting limits of integration.',
          },
        ],
        derivationsOrTheorems: [
          'Proof of Γ(1/2) = √π using polar coordinate substitution in Gaussian integral.',
          'Derivation of Beta-Gamma relation B(m,n) = Γ(m)Γ(n) / Γ(m+n).',
        ],
        frequentExamQuestions: [
          {
            question: 'Evaluate ∬_R xy dx dy over the positive quadrant of the ellipse (x²/a² + y²/b²) ≤ 1.',
            marks: 7,
            answerSummary:
              'Substitute x = a r cosθ, y = b r sinθ with Jacobian J = abr; evaluate r from 0 to 1 and θ from 0 to π/2 to obtain a²b²/8.',
          },
        ],
      },
      {
        unitNumber: 4,
        unitTitle: 'Unit-IV: Ordinary Differential Equations (ODEs)',
        weightage: '20% (14 Marks)',
        summary:
          'First order exact differential equations, integrating factors, linear differential equations of higher order with constant coefficients, method of variation of parameters, Cauchy-Euler homogeneous linear equations.',
        keyFormulas: [
          'Exact ODE condition: ∂M/∂y = ∂N/∂x for M(x, y)dx + N(x, y)dy = 0',
          'Solution: ∫_{y=const} M dx + ∫ (terms of N independent of x) dy = C',
          'Method of Variation of Parameters: y_p = -y1 ∫ [y2 X / W] dx + y2 ∫ [y1 X / W] dx (where W is Wronskian = y1 y2\' - y1\' y2).',
        ],
        keyConcepts: [
          {
            heading: 'Linear ODE with Constant Coefficients',
            description:
              'f(D)y = X. Complete Solution = Complementary Function (C.F.) + Particular Integral (P.I.). P.I. formulas: 1/f(D) [e^{ax}] = e^{ax}/f(a); 1/f(D²) [sin(ax)] = sin(ax)/f(-a²); 1/f(D) [x^m] using binomial expansion in D.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of Particular Integral formula for Variation of Parameters method using Wronskian determinant.',
        ],
        frequentExamQuestions: [
          {
            question: 'Solve (D² + a²)y = sec(ax) using the method of variation of parameters.',
            marks: 7,
            answerSummary:
              'C.F. = c1 cos(ax) + c2 sin(ax). Wronskian W = a. Evaluate integral to find y_p = (1/a²) cos(ax) ln|cos(ax)| + (x/a) sin(ax).',
          },
        ],
      },
      {
        unitNumber: 5,
        unitTitle: 'Unit-V: Matrices & Linear Algebra',
        weightage: '20% (14 Marks)',
        summary:
          'Rank of a matrix, Row echelon and normal forms, consistency of linear system of equations (AX=B, Rouche-Capelli theorem), Eigenvalues and Eigenvectors, Cayley-Hamilton theorem, and matrix diagonalization.',
        keyFormulas: [
          'Characteristic Equation: det(A - λ I) = 0',
          'Properties of Eigenvalues: Sum of eigenvalues = Trace(A); Product of eigenvalues = det(A).',
          'System Consistency: System AX=B is consistent iff Rank(A) = Rank([A|B]). Unique solution if Rank = n; Infinitely many if Rank < n.',
        ],
        keyConcepts: [
          {
            heading: 'Cayley-Hamilton Theorem & Inverse Calculation',
            description:
              'Every square matrix A satisfies its own characteristic polynomial P(λ) = λ³ - c1 λ² + c2 λ - c3 = 0, so A³ - c1 A² + c2 A - c3 I = 0. Multiplying by A^-1 yields A^-1 = (1/c3) [A² - c1 A + c2 I].',
          },
        ],
        derivationsOrTheorems: [
          'Proof that eigenvalues of real symmetric matrix are strictly real.',
          'Proof that eigenvectors corresponding to distinct eigenvalues of a symmetric matrix are mutually orthogonal.',
        ],
        frequentExamQuestions: [
          {
            question: 'Verify Cayley-Hamilton theorem for matrix A = [[1, 2], [2, -1]] and find its inverse and A⁴.',
            marks: 7,
            answerSummary:
              'Characteristic equation λ² - 5 = 0. Verify A² - 5I = 0. Compute A^-1 = 1/5 A and A⁴ = (A²)² = 25 I.',
          },
        ],
      },
    ],
  },

  // 4. BASICS OF ELECTRICAL ENGINEERING (EE-101)
  'sub-basic-elec': {
    subjectId: 'sub-basic-elec',
    subjectCode: 'EE-101',
    subjectName: 'Basics of Electrical',
    shortDescription:
      'DC network theorems (Thevenin, Norton, Superposition, Maximum Power Transfer), AC single phase circuits, 3-phase circuits, transformers, and DC machines.',
    textbook: 'Basic Electrical Engineering by D.P. Kothari & I.J. Nagrath / V.K. Mehta',
    driveFolderUrl: OFFICIAL_FIRST_YEAR_DRIVE_LINK,
    totalPdfPages: '164 Pages · Full Unit Notes',
    quickFormulas: [
      {
        title: 'Thevenin to Norton Conversion',
        formula: 'I_N = V_{th} / R_{th}, and R_N = R_{th}',
        note: 'Load current I_L = V_{th} / (R_{th} + R_L) = I_N · [R_N / (R_N + R_L)].',
      },
      {
        title: 'Maximum Power Transfer Theorem',
        formula: 'P_{max} = V_{th}² / (4 R_{th}) (when R_L = R_{th})',
        note: 'Efficiency at maximum power transfer condition is strictly 50%.',
      },
      {
        title: 'Series RLC Resonance',
        formula: 'f_0 = 1 / [2 π √(L C)], and Quality Factor Q = (1 / R) √(L / C) = ω_0 L / R',
        note: 'At resonance, impedance is minimum Z = R, power factor is unity (cos φ = 1).',
      },
      {
        title: 'Two-Wattmeter 3-Phase Power & Power Factor',
        formula: 'Total Power P = W1 + W2; Power factor tan φ = √3 (W1 - W2) / (W1 + W2)',
        note: 'If W1 = W2 ⇒ cos φ = 1; If one wattmeter reads zero ⇒ cos φ = 0.5; If one reads negative ⇒ cos φ < 0.5.',
      },
      {
        title: 'Transformer EMF Equation',
        formula: 'E1 = 4.44 f N1 Φ_m, E2 = 4.44 f N2 Φ_m',
        note: 'Transformation ratio K = E2/E1 = N2/N1 = I1/I2.',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit-I: DC Network Analysis & Theorems',
        weightage: '20% (14 Marks)',
        summary:
          'Kirchhoff Current and Voltage Laws (KCL, KVL), Mesh analysis, Nodal analysis, Star-Delta transformations, Superposition Theorem, Thevenin Theorem, Norton Theorem, and Maximum Power Transfer Theorem.',
        keyFormulas: [
          'Star to Delta: R_AB = R_A + R_B + (R_A R_B / R_C)',
          'Delta to Star: R_A = (R_AB · R_CA) / (R_AB + R_BC + R_CA)',
        ],
        keyConcepts: [
          {
            heading: 'Thevenin and Norton Theorems',
            description:
              'Any linear bilateral active two-terminal network can be replaced by an equivalent voltage source Vth in series with resistance Rth (Thevenin), or an equivalent current source IN in parallel with resistance RN (Norton). To find Rth: deactivate all independent sources (short circuit voltage sources, open circuit current sources).',
          },
        ],
        derivationsOrTheorems: [
          'Mathematical derivation of Maximum Power Transfer condition dP_L / dR_L = 0 ⇒ R_L = R_{th}.',
        ],
        frequentExamQuestions: [
          {
            question: 'State and prove Thevenin Theorem with an illustrative circuit diagram.',
            marks: 7,
            answerSummary:
              'Define statement, demonstrate open-circuit voltage Voc computation and equivalent resistance Rth determination with deactivated sources.',
          },
        ],
      },
      {
        unitNumber: 2,
        unitTitle: 'Unit-II: Single Phase AC Circuits',
        weightage: '20% (14 Marks)',
        summary:
          'Generation of sinusoidal AC, RMS and average values, form factor, peak factor, series R-L, R-C, and R-L-C circuits, phasor diagrams, power factor, active, reactive, and apparent power, and series resonance.',
        keyFormulas: [
          'Form Factor = RMS Value / Average Value = 1.11 (for sine wave)',
          'Peak Factor = Peak Value / RMS Value = 1.414',
          'Apparent Power S = V I (VA), Active Power P = V I cos φ (Watts), Reactive Power Q = V I sin φ (VAR)',
        ],
        keyConcepts: [
          {
            heading: 'Series R-L-C Resonance',
            description:
              'Occurs when inductive reactance equals capacitive reactance: X_L = X_C ⇒ ω L = 1 / (ω C). Net reactance is zero, impedance Z = R (minimum), current is maximum I = V / R and in phase with voltage. Voltage magnification across L or C equals Q · V.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of RMS and Average values of pure sinusoidal alternating waveform.',
          'Derivation of resonant frequency and half-power bandwidth Δf = f0 / Q for series RLC.',
        ],
        frequentExamQuestions: [
          {
            question: 'Derive an expression for impedance and current in a series R-L-C circuit. Draw phasor diagrams for XL > XC, XL < XC, and XL = XC.',
            marks: 7,
            answerSummary:
              'Express Z = √(R² + (XL - XC)²), tan φ = (XL - XC)/R, and draw phasors showing lagging, leading, and unity power factors.',
          },
        ],
      },
      {
        unitNumber: 3,
        unitTitle: 'Unit-III: Three Phase Systems & Power Measurement',
        weightage: '20% (14 Marks)',
        summary:
          'Advantages of 3-phase over 1-phase systems, Star and Delta connections, relationship between line and phase voltages and currents, 3-phase power measurement using two-wattmeter method with balanced loads.',
        keyFormulas: [
          'Star Connection: V_L = √3 V_{ph}, I_L = I_{ph}',
          'Delta Connection: V_L = V_{ph}, I_L = √3 I_{ph}',
          'Total 3-Phase Power: P = √3 V_L I_L cos φ = 3 V_{ph} I_{ph} cos φ',
        ],
        keyConcepts: [
          {
            heading: 'Two-Wattmeter Power Measurement',
            description:
              'Wattmeters W1 and W2 connected with current coils in lines R and Y, voltage coils between R-B and Y-B. Reading W1 = V_L I_L cos(30° - φ), W2 = V_L I_L cos(30° + φ). Total active power W1 + W2 = √3 V_L I_L cos φ.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of line-phase relations V_L = √3 V_{ph} in Star connection using phasor addition.',
          'Derivation of tan φ formula in two-wattmeter method.',
        ],
        frequentExamQuestions: [
          {
            question: 'Explain the Two-Wattmeter method for measuring 3-phase power. Discuss cases when power factor is 1, 0.5, and 0.',
            marks: 7,
            answerSummary:
              'Show phasor diagram, derive W1 + W2 = P, and explain wattmeter readings for φ = 0°, 60°, and 90°.',
          },
        ],
      },
      {
        unitNumber: 4,
        unitTitle: 'Unit-IV: Magnetic Circuits & Single-Phase Transformers',
        weightage: '20% (14 Marks)',
        summary:
          'Magnetic circuits, MMF, flux, reluctance, comparison with electric circuits, B-H curve, hysteresis and eddy current losses, 1-phase transformer working principle, EMF equation, equivalent circuit, losses, and efficiency.',
        keyFormulas: [
          'Reluctance S = l / (μ0 μr A) (A-t/Wb)',
          'Hysteresis Loss (Steinmetz formula): P_h = η B_m^{1.6} f V',
          'Eddy Current Loss: P_e = K_e B_m² f² t² V',
          'Transformer Efficiency: η = (x S cos φ) / [x S cos φ + P_i + x² P_{cu}]',
        ],
        keyConcepts: [
          {
            heading: 'Transformer Principle & EMF Equation',
            description:
              'Static device transferring electrical energy between circuits via mutual induction without frequency change. Primary creates alternating flux Φ = Φm sin(ωt), inducing EMF e1 = -N1 dΦ/dt and e2 = -N2 dΦ/dt. RMS values: E1 = 4.44 f N1 Φm.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of transformer EMF equation E = 4.44 f N Φm.',
          'Condition for maximum efficiency of transformer: Iron Loss = Copper Loss (P_i = P_{cu}).',
        ],
        frequentExamQuestions: [
          {
            question: 'Derive the EMF equation of a single-phase transformer. Deduce condition for maximum efficiency.',
            marks: 7,
            answerSummary:
              'Differentiate magnetic flux sinusoids, obtain peak EMF E_m = 2π f N Φ_m, divide by √2 for RMS, and set dη/dI = 0.',
          },
        ],
      },
      {
        unitNumber: 5,
        unitTitle: 'Unit-V: Electrical Machines & Domestic Safety',
        weightage: '20% (14 Marks)',
        summary:
          'DC Machines: construction, working principle of DC generator and DC motor, back EMF, single-phase induction motor working and split-phase starting, earthing (pipe and plate earthing), MCB, ELCB, and electric shock prevention.',
        keyFormulas: [
          'DC Motor Back EMF: E_b = (P Φ Z N) / (60 A)',
          'DC Motor Torque: T = (P Φ Z I_a) / (2 π A) ∝ Φ I_a',
        ],
        keyConcepts: [
          {
            heading: 'DC Motor Principle & Back EMF',
            description:
              'When current-carrying armature conductors lie in a magnetic field, they experience magnetic force F = B I L (Fleming Left Hand Rule), generating driving torque. As armature rotates, it cuts magnetic flux, inducing Back EMF Eb opposing applied voltage V (Lenz Law). Armature current Ia = (V - Eb) / Ra.',
          },
          {
            heading: 'Earthing & Safety Devices (MCB / ELCB)',
            description:
              'Earthing connects metallic equipment enclosures to earth electrode (resistance < 5 Ω). Pipe earthing uses perforated GI pipe surrounded by charcoal and salt layers. MCB trips thermally (bimetal) for overload and magnetically (solenoid) for short circuit. ELCB / RCCB detects residual leakage current (>30 mA) to prevent fatal electric shocks.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of DC motor torque equation T_a = 0.159 (P Φ Z Ia / A) N·m.',
        ],
        frequentExamQuestions: [
          {
            question: 'Explain the working principle of a DC motor and the role of Back EMF as a self-regulating mechanism.',
            marks: 7,
            answerSummary:
              'Show voltage equation V = Eb + Ia Ra, explain how Eb decreases when mechanical load increases to draw more armature current automatically.',
          },
        ],
      },
    ],
  },

  // 5. BASICS OF ELECTRONICS (EC-101)
  'sub-basic-electr': {
    subjectId: 'sub-basic-electr',
    subjectCode: 'EC-101',
    subjectName: 'Basics of Electronics',
    shortDescription:
      'Semiconductor diodes, rectifiers, Zener regulator, BJTs, FETs, MOSFETs, Op-Amps, and digital logic gate fundamentals.',
    textbook: 'Electronic Devices and Circuit Theory by Robert L. Boylestad / David A. Bell',
    driveFolderUrl: OFFICIAL_FIRST_YEAR_DRIVE_LINK,
    totalPdfPages: '148 Pages · Full Unit Notes',
    quickFormulas: [
      {
        title: 'Shockley Diode Equation',
        formula: 'I = I_s [exp(q V / η k T) - 1]',
        note: 'Is = reverse saturation current, η = ideality factor (1 for Ge, 2 for Si), VT = kT/q ≈ 26 mV at 300 K.',
      },
      {
        title: 'Full-Wave Bridge Rectifier Efficiency & Ripple',
        formula: 'Efficiency η = 81.2%, Ripple Factor γ = √( (V_{rms}/V_{dc})² - 1 ) = 0.482',
        note: 'Half-wave rectifier: η = 40.6%, γ = 1.21. PIV for bridge = Vm, for center-tapped = 2 Vm.',
      },
      {
        title: 'Transistor Alpha & Beta Relation',
        formula: 'β = α / (1 - α), and α = β / (1 + β); I_E = I_B + I_C',
        note: 'Common Emitter current gain β typically ranges from 50 to 300.',
      },
      {
        title: 'Inverting & Non-Inverting Op-Amp Gain',
        formula: 'Inverting: A_v = -R_f / R_1; Non-Inverting: A_v = 1 + (R_f / R_1)',
        note: 'Based on ideal Op-Amp concept: infinite input impedance, infinite open-loop gain, and virtual short.',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit-I: Semiconductor Diodes & Power Rectifiers',
        weightage: '20% (14 Marks)',
        summary:
          'P-N junction diode physics, forward and reverse bias characteristics, ideal vs practical diode, Zener diode avalanche/zener breakdown, Zener voltage regulator, Half-wave, Full-wave center-tapped and Bridge rectifiers, filters, clippers and clampers.',
        keyFormulas: [
          'Ripple Factor γ = √[ (I_{rms} / I_{dc})² - 1 ]',
          'Bridge Rectifier V_dc = (2 V_m) / π',
        ],
        keyConcepts: [
          {
            heading: 'Zener Diode as Voltage Regulator',
            description:
              'Operates in reverse breakdown region where voltage Vz remains virtually constant over a wide range of reverse current Iz (between Iz_min and Iz_max). When input voltage Vin or load current IL varies, Zener current Iz adjusts to keep Vout = Vz across the load.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of rectification efficiency and ripple factor for Half Wave and Full Wave Bridge Rectifiers.',
        ],
        frequentExamQuestions: [
          {
            question: 'Explain the working of a Full Wave Bridge Rectifier with circuit diagram, waveforms, ripple factor, and efficiency derivation.',
            marks: 7,
            answerSummary:
              'Diagram showing 4 diodes D1-D4 conducting in pairs alternately during positive and negative half cycles, derive Vdc = 2Vm/π, η = 81.2%, γ = 0.482.',
          },
        ],
      },
      {
        unitNumber: 2,
        unitTitle: 'Unit-II: Bipolar Junction Transistors (BJT)',
        weightage: '20% (14 Marks)',
        summary:
          'BJT construction (NPN and PNP), operation in active, cutoff, and saturation regions, CB, CE, and CC configurations, input and output characteristics of CE configuration, DC load line, Q-point stability, and voltage divider bias.',
        keyFormulas: [
          'I_C = β I_B + (1 + β) I_{CBO}',
          'DC Load Line: V_{CE} = V_{CC} - I_C (R_C + R_E)',
        ],
        keyConcepts: [
          {
            heading: 'CE Transistor Characteristics & Bias Stability',
            description:
              'CE is most widely used due to high voltage gain and power gain. Input characteristics plot Ib vs Vbe at constant Vce. Output characteristics plot Ic vs Vce at constant Ib. Voltage divider bias is preferred as it makes Q-point virtually independent of transistor β variation and temperature.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of relation between α and β, and stability factor S = dIc/dIco for voltage divider bias.',
        ],
        frequentExamQuestions: [
          {
            question: 'Draw input and output characteristics of a CE transistor configuration. Explain the significance of the Q-point.',
            marks: 7,
            answerSummary:
              'Plot curves indicating active, saturation, and cut-off regions; show DC load line intersection at quiescent Q-point for distortion-free amplification.',
          },
        ],
      },
      {
        unitNumber: 3,
        unitTitle: 'Unit-III: Field Effect Transistors (FET & MOSFET)',
        weightage: '20% (14 Marks)',
        summary:
          'JFET construction, working, drain and transfer characteristics, pinch-off voltage, Shockley equation, Enhancement and Depletion MOSFETs, CMOS inverter principle, comparison between BJT and FET.',
        keyFormulas: [
          'Shockley Equation for JFET: I_D = I_{DSS} [1 - (V_{GS} / V_P)]²',
          'Transconductance g_m = ∂I_D / ∂V_{GS} = g_{m0} [1 - (V_{GS} / V_P)]',
        ],
        keyConcepts: [
          {
            heading: 'BJT vs FET / MOSFET Comparison',
            description:
              'BJT is bipolar (conduction by electrons and holes), current-controlled device (input current Ib controls output Ic), low input impedance (~1 kΩ). FET is unipolar (majority carriers only), voltage-controlled device (Vgs controls Id), extremely high input impedance (>10^8 Ω for JFET, >10^12 Ω for MOSFET).',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of JFET transconductance gm and small-signal amplification parameter relation μ = gm · rd.',
        ],
        frequentExamQuestions: [
          {
            question: 'Explain the construction and transfer characteristics of an n-channel JFET. Define Pinch-off voltage.',
            marks: 7,
            answerSummary:
              'Show symmetric reverse-biased p-n junctions narrowing conducting channel, define Vp as Vds where channel completely pinches off, state Shockley relation.',
          },
        ],
      },
      {
        unitNumber: 4,
        unitTitle: 'Unit-IV: Operational Amplifiers (Op-Amps)',
        weightage: '20% (14 Marks)',
        summary:
          'Ideal Op-Amp characteristics (infinite open loop gain, infinite input impedance, zero output impedance, infinite CMRR, infinite bandwidth), virtual ground concept, inverting amplifier, non-inverting amplifier, summing amplifier, differentiator, and integrator.',
        keyFormulas: [
          'Inverting Amplifier: V_{out} = - (R_f / R_1) V_{in}',
          'Non-Inverting Amplifier: V_{out} = [1 + (R_f / R_1)] V_{in}',
          'Integrator: V_{out} = -1 / (R_1 C) ∫ V_{in} dt',
          'Differentiator: V_{out} = -R_f C (dV_{in} / dt)',
        ],
        keyConcepts: [
          {
            heading: 'Virtual Ground Concept in Op-Amps',
            description:
              'Because open-loop gain A_OL is near infinity (~10^5 to 10^6) and output voltage Vout is finite (bounded by power rails ±Vcc), differential input voltage Vd = (V+ - V-) = Vout / A_OL ≈ 0. Hence V- = V+. When non-inverting terminal V+ is connected to physical ground (0 V), inverting terminal V- acts as a virtual ground at 0 V without drawing any current due to infinite input resistance.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of inverting and non-inverting closed loop gain using Kirchhoff Current Law at virtual ground node.',
        ],
        frequentExamQuestions: [
          {
            question: 'State 6 characteristics of an ideal Op-Amp. Derive an expression for output voltage of an Op-Amp Integrator.',
            marks: 7,
            answerSummary:
              'List ideal parameters (A=∞, Rin=∞, Rout=0, CMRR=∞, slew rate=∞, offset=0); write KCL i_in = i_C, Vin/R1 = -C dVout/dt, integrate to obtain Vout = -(1/RC) ∫ Vin dt.',
          },
        ],
      },
      {
        unitNumber: 5,
        unitTitle: 'Unit-V: Digital Logic Fundamentals & Number Systems',
        weightage: '20% (14 Marks)',
        summary:
          'Number systems (Binary, Octal, Decimal, Hexadecimal conversions), 1s and 2s complement arithmetic, basic logic gates (AND, OR, NOT), universal gates (NAND, NOR), Boolean algebra theorems, De Morgan laws, and Karnaugh Map (K-map) minimization up to 4 variables.',
        keyFormulas: [
          'De Morgan First Law: (A + B)\' = A\' · B\'',
          'De Morgan Second Law: (A · B)\' = A\' + B\'',
          '2s Complement of binary number = 1s Complement + 1',
        ],
        keyConcepts: [
          {
            heading: 'Universal Gates (NAND & NOR)',
            description:
              'NAND and NOR gates are termed universal gates because any combinational digital circuit or basic gate (NOT, AND, OR, XOR, XNOR) can be implemented solely using only NAND gates or only NOR gates without requiring any other gate type.',
          },
          {
            heading: 'K-Map Minimization',
            description:
              'Graphical method for simplifying Boolean expressions using Gray code adjacency. Cells are grouped in powers of 2 (pairs of 2, quads of 4, octets of 8). Eliminates redundant variables and directly yields Minimal Sum of Products (SOP) or Product of Sums (POS).',
          },
        ],
        derivationsOrTheorems: [
          'Proof of De Morgan theorems using truth tables and Boolean algebraic axioms.',
          'Implementation of basic logic gates (NOT, AND, OR) using only 2-input NAND gates.',
        ],
        frequentExamQuestions: [
          {
            question: 'Why are NAND and NOR called Universal gates? Realize AND, OR, and NOT gates using only NOR gates.',
            marks: 7,
            answerSummary:
              'Provide circuit diagrams and truth table derivations for NOT from NOR (tied inputs), OR from NOR (NOR followed by inverter), AND from NOR (De Morgan inverted inputs into NOR).',
          },
        ],
      },
    ],
  },

  // 6. BASICS OF COMPUTER SCIENCE (CS-101)
  'sub-basic-cs': {
    subjectId: 'sub-basic-cs',
    subjectCode: 'CS-101',
    subjectName: 'Basics of Computer Science',
    shortDescription:
      'Computer architecture, memory hierarchy, algorithm & flowcharts, C/Python programming, arrays, pointers, functions, structures, and basic networking.',
    textbook: 'Programming in ANSI C by E. Balagurusamy / Problem Solving and Python Programming',
    driveFolderUrl: OFFICIAL_FIRST_YEAR_DRIVE_LINK,
    totalPdfPages: '152 Pages · Full Unit Notes & Code Manual',
    quickFormulas: [
      {
        title: 'Binary Search Time Complexity',
        formula: 'T(n) = O(log2 n) [Worst & Average Case], O(1) [Best Case]',
        note: 'Requires array to be pre-sorted. Compares key with middle element A[mid].',
      },
      {
        title: 'Linear Search vs Binary Search',
        formula: 'Linear: O(n) comparisons; Binary: O(log2 n) comparisons',
        note: 'For 1,000,000 elements: Linear takes ~1,000,000 ops, Binary takes at most 20 ops.',
      },
      {
        title: 'Pointer Arithmetic & Memory Address Offset',
        formula: 'Address of arr[i] = Base_Address + i × sizeof(data_type)',
        note: 'For 2D array arr[R][C] in row-major order: Address(arr[i][j]) = Base + (i × C + j) × sizeof(type).',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit-I: Computer Architecture & Foundations',
        weightage: '20% (14 Marks)',
        summary:
          'Von Neumann computer model (CPU, ALU, CU, Registers), Memory hierarchy (Registers, Cache L1/L2/L3, RAM, Secondary SSD/HDD), System software vs Application software, Compilers vs Interpreters, Algorithms, Flowcharts, and Pseudo-code.',
        keyFormulas: [
          'Average Memory Access Time (AMAT) = Hit_Time + Miss_Rate × Miss_Penalty',
        ],
        keyConcepts: [
          {
            heading: 'Von Neumann Architecture vs Harvard Architecture',
            description:
              'Von Neumann uses a single shared bus and memory space for both program instructions and data (subject to Von Neumann bus bottleneck). Harvard architecture utilizes separate physical buses and memories for instructions and data, allowing simultaneous fetch and execute.',
          },
          {
            heading: 'Compiler vs Interpreter',
            description:
              'Compiler translates entire source program into machine code in one go, generating an executable binary (.exe/a.out); faster runtime execution, high initial compilation time (C, C++, Rust). Interpreter translates and executes program line-by-line; easier debugging, slower runtime execution (Python, JS).',
          },
        ],
        derivationsOrTheorems: [
          'Step-by-step algorithm and flowchart design for quadratic equation roots, prime number verification, and Fibonacci sequence.',
        ],
        frequentExamQuestions: [
          {
            question: 'Explain the Von Neumann computer model with a block diagram. Detail the memory hierarchy in modern computers.',
            marks: 7,
            answerSummary:
              'Draw CPU with ALU, CU, PC, IR, MAR, MDR, bus interface; sketch pyramid memory hierarchy illustrating trade-off between speed, capacity, and cost.',
          },
        ],
      },
      {
        unitNumber: 2,
        unitTitle: 'Unit-II: C / Python Syntax & Flow Control',
        weightage: '20% (14 Marks)',
        summary:
          'Data types (int, float, char, double), variable declarations, constants, operators (arithmetic, relational, logical, bitwise, ternary), operator precedence and associativity, decision making (if, if-else, nested-if, switch-case), loops (while, for, do-while, break, continue).',
        keyFormulas: [
          'Precedence: Parentheses () > Unary ++, --, ! > Arithmetic *, /, % > Arithmetic +, - > Relational > Logical && > Logical || > Assignment =',
        ],
        keyConcepts: [
          {
            heading: 'Entry-Controlled vs Exit-Controlled Loops',
            description:
              'While and For loops are entry-controlled: loop condition is tested before executing loop body; if condition is initially false, body executes 0 times. Do-while loop is exit-controlled: condition is tested at the end of loop body, guaranteeing that body executes at least once.',
          },
        ],
        derivationsOrTheorems: [
          'Trace execution of switch-case with fall-through and break statements.',
        ],
        frequentExamQuestions: [
          {
            question: 'Differentiate between while and do-while loops with syntax, flowcharts, and code examples.',
            marks: 7,
            answerSummary:
              'Highlight entry vs exit check, minimum iterations (0 vs 1), semicolon at end of do-while, and write code printing sum of digits.',
          },
        ],
      },
      {
        unitNumber: 3,
        unitTitle: 'Unit-III: Arrays, Strings & Modular Functions',
        weightage: '20% (14 Marks)',
        summary:
          '1D arrays, 2D arrays, matrix addition and multiplication, string manipulation library functions (strlen, strcpy, strcat, strcmp), user-defined functions, function prototypes, parameter passing (call by value vs call by reference), recursion mechanics, and stack frame.',
        keyFormulas: [
          'Matrix multiplication condition: Columns of Matrix A must equal Rows of Matrix B (C[i][j] = Σ A[i][k] × B[k][j]).',
        ],
        keyConcepts: [
          {
            heading: 'Call by Value vs Call by Reference',
            description:
              'In Call by Value, a copy of the actual argument value is passed to formal parameter; modifications made inside function do NOT affect caller variable. In Call by Reference (using pointers in C), the memory address of actual parameter is passed; changes made through dereferencing directly modify original caller variable.',
          },
          {
            heading: 'Recursion & Activation Records',
            description:
              'Function calling itself with a base terminating condition. Each recursive call allocates a new activation frame on the runtime call stack containing local variables and return address. Missing base condition causes stack overflow runtime crash.',
          },
        ],
        derivationsOrTheorems: [
          'Trace recursive factorial and Tower of Hanoi stack activation frames.',
        ],
        frequentExamQuestions: [
          {
            question: 'Write a C program to perform matrix multiplication of two matrices with dimension validation and pointer arithmetic.',
            marks: 7,
            answerSummary:
              'Include checks for c1 == r2, nested loops (i, j, k), dynamic or static allocation, and result computation.',
          },
        ],
      },
      {
        unitNumber: 4,
        unitTitle: 'Unit-IV: Pointers & Structured Data Types',
        weightage: '20% (14 Marks)',
        summary:
          'Pointer fundamentals, address-of (&) and dereferencing (*) operators, pointer arithmetic, pointers and arrays, dynamic memory allocation functions (malloc, calloc, realloc, free), structures, unions, difference between structure and union, and array of structures.',
        keyFormulas: [
          'malloc(size_t size) - allocates uninitialized memory block.',
          'calloc(n, size_t size) - allocates memory for n elements and initializes all bytes to zero.',
          'free(ptr) - deallocates dynamically allocated memory to prevent memory leaks.',
        ],
        keyConcepts: [
          {
            heading: 'Structure vs Union in C',
            description:
              'In a struct, each member has its own distinct memory location; total size of struct ≥ sum of sizes of all members (plus padding bytes for memory alignment). In a union, all members share the same common memory location; size of union equals size of its largest member; only one member can be stored and accessed at any given time.',
          },
        ],
        derivationsOrTheorems: [
          'Memory map comparison between struct and union containing int, float, and char[20].',
        ],
        frequentExamQuestions: [
          {
            question: 'Compare structure and union in C with respect to memory allocation, syntax, and sample use cases.',
            marks: 7,
            answerSummary:
              'Draw byte memory layout showing independent member fields in struct vs overlapping shared buffer in union, explain sizeof operator output.',
          },
        ],
      },
      {
        unitNumber: 5,
        unitTitle: 'Unit-V: Fundamental Algorithms & Networking Basics',
        weightage: '20% (14 Marks)',
        summary:
          'Searching algorithms (Linear search, Binary search), Sorting algorithms (Bubble sort, Selection sort, Insertion sort), Computer network basics (LAN, MAN, WAN), network topologies (Star, Bus, Ring, Mesh), OSI 7-layer model, and IP addressing.',
        keyFormulas: [
          'Bubble Sort Comparisons: n(n - 1) / 2 = O(n²) in worst and average case.',
          'Insertion Sort: O(n) best case (already sorted array), O(n²) worst case.',
        ],
        keyConcepts: [
          {
            heading: 'OSI 7-Layer Architecture',
            description:
              'Standard conceptual framework for network communication: 7. Application (HTTP, FTP, DNS), 6. Presentation (SSL/TLS encryption, compression), 5. Session (RPC, session tokens), 4. Transport (TCP, UDP, port numbers, flow control), 3. Network (IP addressing, routing), 2. Data Link (Ethernet frames, MAC addressing, switch), 1. Physical (bits, cables, voltage levels).',
          },
        ],
        derivationsOrTheorems: [
          'Step-by-step pass trace of Bubble Sort and Selection Sort on unsorted array [64, 25, 12, 22, 11].',
        ],
        frequentExamQuestions: [
          {
            question: 'Explain the 7 layers of OSI reference model with primary responsibilities and protocols of each layer.',
            marks: 7,
            answerSummary:
              'Provide top-to-bottom diagram, data encapsulation units (data -> segment -> packet -> frame -> bits), and key functionalities.',
          },
        ],
      },
    ],
  },

  // 7. FUNDAMENTALS OF MECHANICAL ENGINEERING (ME-102)
  'sub-fund-mech': {
    subjectId: 'sub-fund-mech',
    subjectCode: 'ME-102',
    subjectName: 'Fundamentals of Mechanical',
    shortDescription:
      'Thermodynamics laws, Steam boilers (Cochran, Babcock-Wilcox), IC engines (2-stroke/4-stroke Otto & Diesel), power transmission (belts, gears), and machine tools.',
    textbook: 'Basic Mechanical Engineering by Pravin Kumar / R.K. Rajput',
    driveFolderUrl: OFFICIAL_FIRST_YEAR_DRIVE_LINK,
    totalPdfPages: '146 Pages · Full Unit Notes',
    quickFormulas: [
      {
        title: 'First Law of Thermodynamics (Non-Flow Process)',
        formula: 'δQ = dU + δW, or Q = (U2 - U1) + W',
        note: 'For ideal gas: dU = m cv dT, dH = m cp dT, W = ∫ P dV.',
      },
      {
        title: 'Carnot Heat Engine Efficiency',
        formula: 'η = 1 - (T_L / T_H) = (W_{net}) / Q_H',
        note: 'T_L = cold reservoir temp (K), T_H = hot source temp (K). Maximum possible theoretical efficiency.',
      },
      {
        title: 'Air Standard Efficiency of Otto Cycle',
        formula: 'η_{otto} = 1 - [1 / (r^{γ - 1})]',
        note: 'r = compression ratio = V1 / V2 (typically 6-10 for petrol engines), γ = cp/cv ≈ 1.4 for air.',
      },
      {
        title: 'Belt Drive Velocity Ratio & Power',
        formula: 'Velocity Ratio = N2 / N1 = (d1 + t) / (d2 + t); Power P = (T1 - T2) · v',
        note: 'T1 = tension in tight side, T2 = tension in slack side, v = belt speed in m/s.',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit-I: Thermodynamics & Laws of Heat',
        weightage: '20% (14 Marks)',
        summary:
          'Thermodynamic systems (closed, open, isolated), properties (intensive vs extensive), thermodynamic state, equilibrium, processes (isochoric, isobaric, isothermal, adiabatic, polytropic), Zeroth Law (temperature concept), First Law of thermodynamics, Second Law (Kelvin-Planck and Clausius statements), Carnot cycle, and concept of entropy.',
        keyFormulas: [
          'Work in Reversible Adiabatic Process: W = (P1 V1 - P2 V2) / (γ - 1)',
          'Work in Isothermal Process: W = P1 V1 ln(V2 / V1) = m R T ln(P1 / P2)',
          'Clausius Inequality: ∮ (δQ / T) ≤ 0 (= 0 for reversible cycle, < 0 for irreversible cycle)',
        ],
        keyConcepts: [
          {
            heading: 'Second Law of Thermodynamics Statements',
            description:
              'Kelvin-Planck Statement: It is impossible to construct a device operating in a cycle that will produce no effect other than the extraction of heat from a single reservoir and performance of an equivalent amount of work (perpetual motion machine of second kind PMM-2 is impossible). Clausius Statement: It is impossible to construct a device that transfers heat from a lower temperature body to a higher temperature body without external work input.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of First Law of Thermodynamics for steady-flow open system (SFEE): h1 + v1²/2 + gz1 + q = h2 + v2²/2 + gz2 + w.',
          'Derivation of Carnot thermal efficiency η = 1 - T2/T1 from P-V and T-s diagrams.',
        ],
        frequentExamQuestions: [
          {
            question: 'State Kelvin-Planck and Clausius statements of Second Law of Thermodynamics and prove their equivalence.',
            marks: 7,
            answerSummary:
              'Draw schematic diagrams showing violation of Clausius leading to violation of Kelvin-Planck and vice versa.',
          },
        ],
      },
      {
        unitNumber: 2,
        unitTitle: 'Unit-II: Steam Generators & Boilers',
        weightage: '20% (14 Marks)',
        summary:
          'Classification of steam boilers (Fire tube vs Water tube, Natural vs Forced circulation, High vs Low pressure), Cochran vertical multi-tubular fire-tube boiler, Babcock & Wilcox longitudinal water-tube boiler, boiler mountings (safety valve, water level indicator, pressure gauge, fusible plug, steam stop valve, blow-off cock, feed check valve) and boiler accessories (economizer, air pre-heater, superheater, feed pump).',
        keyFormulas: [
          'Equivalent Evaporation E = [m_s (h - h_{f1})] / 2257 (kg of steam/kg of coal from & at 100°C)',
          'Boiler Efficiency η = [m_s (h - h_{f1})] / (m_f × C.V.)',
        ],
        keyConcepts: [
          {
            heading: 'Mountings vs Accessories',
            description:
              'Boiler Mountings are compulsory fittings mounted directly on boiler shell essential for its safe, functional operation (Water level indicator, Pressure gauge, Spring loaded safety valve, Fusible plug). Boiler Accessories are optional supplementary components installed in flue gas path to increase thermal efficiency and fuel economy (Economizer preheats feed water, Air pre-heater preheats combustion air, Superheater raises steam temperature).',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of equivalent evaporation from and at 100°C and boiler thermal efficiency equation.',
        ],
        frequentExamQuestions: [
          {
            question: 'Describe Babcock & Wilcox water tube boiler with a neat sketch showing water circulation and path of flue gases.',
            marks: 7,
            answerSummary:
              'Label steam and water drum, inclined water tubes, uptake and downtake headers, mud box, baffles, superheater, dampers, and soot blowers.',
          },
        ],
      },
      {
        unitNumber: 3,
        unitTitle: 'Unit-III: Internal Combustion (IC) Engines',
        weightage: '20% (14 Marks)',
        summary:
          'Classification of IC engines, working principle of 4-Stroke Petrol (Otto) engine, 4-Stroke Diesel (CI) engine, 2-Stroke Petrol engine, comparison between 2-stroke and 4-stroke engines, comparison between Petrol (SI) and Diesel (CI) engines, engine terminology (Bore, Stroke, Clearance Volume, Swept Volume, Compression Ratio), indicated power, brake power, and mechanical efficiency.',
        keyFormulas: [
          'Compression Ratio r = (V_s + V_c) / V_c',
          'Indicated Power IP = (P_{mean} · L · A · N · k) / 60000 (kW) [k = 1 for 2-stroke, 1/2 for 4-stroke]',
          'Brake Power BP = (2 π N T) / 60000 (kW)',
          'Mechanical Efficiency η_{mech} = BP / IP',
        ],
        keyConcepts: [
          {
            heading: '4-Stroke Petrol vs 4-Stroke Diesel Engine',
            description:
              'Petrol (SI) Engine: Air-fuel mixture prepared in carburetor/manifold sucked during suction stroke; uses spark plug for ignition; operates on constant-volume Otto cycle; lower compression ratio (6-10); lighter weight. Diesel (CI) Engine: Only pure air sucked during suction stroke; fuel injected into hot compressed air near end of compression stroke causing auto-ignition; operates on constant-pressure Diesel cycle; high compression ratio (14-22); heavier structure, higher thermal efficiency.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of air standard thermal efficiency of Otto cycle as function of compression ratio r.',
        ],
        frequentExamQuestions: [
          {
            question: 'Explain the working of 4-stroke cycle Diesel engine with neat sketches of 4 strokes and P-V diagram.',
            marks: 7,
            answerSummary:
              'Detail Suction stroke (pure air drawn), Compression stroke (high P & T), Expansion/Power stroke (fuel injection & combustion), Exhaust stroke (burnt gas expulsion).',
          },
        ],
      },
      {
        unitNumber: 4,
        unitTitle: 'Unit-IV: Power Transmission Elements',
        weightage: '20% (14 Marks)',
        summary:
          'Belt drives (flat belt, V-belt), open and cross belt drives, velocity ratio, slip, creep, centrifugal tension, power transmitted by belt, chain drives, gear drives (classification: spur, helical, bevel, worm), gear trains (simple, compound, reverted, epicyclic gear trains).',
        keyFormulas: [
          'Ratio of Driving Tensions in Flat Belt: T1 / T2 = e^{μ θ}',
          'Centrifugal Tension: T_c = m v²',
          'Maximum Power Condition in Belt Drive: T_max = 3 T_c ⇒ Optimum speed v = √(T_max / 3m)',
          'Velocity ratio of compound gear train: Speed of last wheel / Speed of first wheel = Product of number of teeth on driving gears / Product of number of teeth on driven gears',
        ],
        keyConcepts: [
          {
            heading: 'Gear Drives vs Belt/Chain Drives',
            description:
              'Gears provide positive power transmission with exact constant velocity ratio (zero slip), high load capacity, compact footprint, and high efficiency, but require precise alignment, continuous lubrication, and are costly. Belt drives provide smooth flexible transmission over larger center distances, absorb shocks, but suffer from slip and lower velocity ratio.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of belt tension ratio formula T1 / T2 = e^{μ θ} using differential element equilibrium.',
          'Proof that maximum power is transmitted by a belt when centrifugal tension equals one-third of maximum allowable tension.',
        ],
        frequentExamQuestions: [
          {
            question: 'Derive the ratio of belt tensions T1/T2 = e^{μθ} for a flat belt drive. Deduce the condition for maximum power transmission.',
            marks: 7,
            answerSummary:
              'Draw differential belt angle element dθ, balance normal reaction dN and frictional force μ dN with tension components, integrate from 0 to θ.',
          },
        ],
      },
      {
        unitNumber: 5,
        unitTitle: 'Unit-V: Manufacturing Processes & Machine Tools',
        weightage: '20% (14 Marks)',
        summary:
          'Foundry and casting: pattern types and allowances, moulding sand properties, steps in sand casting, common casting defects (blowholes, shrinkage cavity, cold shut), welding: Arc welding, Oxy-acetylene gas welding (neutral, oxidizing, carburizing flames), brazing and soldering, Lathe machine: construction, major parts (bed, headstock, tailstock, carriage, lead screw), and lathe operations (turning, facing, knurling, thread cutting, parting off).',
        keyFormulas: [
          'Oxy-acetylene flame ratios: Neutral flame (1:1 O2:C2H2, 3200°C), Oxidizing flame (>1:1 O2, 3300°C), Carburizing flame (<1:1 O2, 3000°C).',
        ],
        keyConcepts: [
          {
            heading: 'Lathe Machine Parts & Kinematics',
            description:
              'Known as mother of all machine tools. Workpiece is held rigidly in chuck on rotating spindle (headstock) while single-point cutting tool is fed into work (carriage). Tailstock supports long workpieces with dead/live centers and holds drilling tools. Lead screw transmits precise feed motion for thread cutting.',
          },
          {
            heading: 'Welding vs Soldering vs Brazing',
            description:
              'Welding fuses parent metals with or without filler at high temperature (>1000°C, metallurgical coalescence). Brazing joins metals using non-ferrous filler (Spelter: Cu-Zn alloy) above 450°C without melting parent metal. Soldering joins thin metals using lead-tin solder alloy (Pb-Sn) below 450°C.',
          },
        ],
        derivationsOrTheorems: [
          'Pattern maker allowances: Shrinkage/contraction allowance, Draft allowance, Machining/finish allowance, Distortion allowance.',
        ],
        frequentExamQuestions: [
          {
            question: 'Draw a block diagram of an engine lathe and explain the functions of Headstock, Tailstock, Carriage, and Lead Screw.',
            marks: 7,
            answerSummary:
              'Neat schematic of center lathe showing cast iron bed, geared headstock, compound rest, cross-slide, apron, and feed rod.',
          },
        ],
      },
    ],
  },

  // 8. FUNDAMENTALS OF CIVIL ENGINEERING (CE-101)
  'sub-fund-civil': {
    subjectId: 'sub-fund-civil',
    subjectCode: 'CE-101',
    subjectName: 'Fundamentals of Civil',
    shortDescription:
      'Building materials (bricks, cement, concrete), building components, surveying (chain, prismatic compass), levelling, contouring, and environmental engineering.',
    textbook: 'Basic Civil Engineering by S.S. Bhavikatti / B.C. Punmia',
    driveFolderUrl: OFFICIAL_FIRST_YEAR_DRIVE_LINK,
    totalPdfPages: '138 Pages · Full Unit Notes',
    quickFormulas: [
      {
        title: 'Correction for Length of Chain',
        formula: 'True Length L\' = [L × (L_nominal ± error)] / L_nominal',
        note: 'True Area A\' = A × (L\' / L)²; True Volume V\' = V × (L\' / L)³.',
      },
      {
        title: 'Included Angle in Compass Surveying',
        formula: 'Included Angle = Fore Bearing of forward line - Fore Bearing of backward line (add 360° if negative)',
        note: 'Back Bearing (BB) = Fore Bearing (FB) ± 180° (+ if FB < 180°, - if FB > 180°).',
      },
      {
        title: 'Height of Instrument (H.I.) Levelling Method',
        formula: 'H.I. = R.L. of Benchmark + Back Sight (B.S.); R.L. of any station = H.I. - Intermediate Sight (I.S.) or Fore Sight (F.S.)',
        note: 'Arithmetic Check: Σ B.S. - Σ F.S. = Last R.L. - First R.L.',
      },
      {
        title: 'Rise and Fall Levelling Method',
        formula: 'Rise or Fall = Previous Reading - Present Reading (+ is Rise, - is Fall)',
        note: 'Arithmetic Check: Σ B.S. - Σ F.S. = Σ Rise - Σ Fall = Last R.L. - First R.L.',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit-I: Construction Materials',
        weightage: '20% (14 Marks)',
        summary:
          'Bricks: composition of good brick earth, manufacturing, qualities of first-class bricks, field and laboratory tests (compressive strength, water absorption < 20%, efflorescence), Cement: types (OPC, PPC, Rapid Hardening), manufacturing (wet and dry process), tests (consistency, initial setting time > 30 min, final setting time < 600 min, fineness), Concrete: ingredients, workability (Slump test, Compaction factor test), water-cement ratio, and grades of concrete (M15, M20, M25).',
        keyFormulas: [
          'Abrams Water-Cement Ratio Law: Compressive strength S = A / B^{w/c}',
          'Nominal concrete mix proportions: M15 (1:2:4), M20 (1:1.5:3), M25 (1:1:2).',
        ],
        keyConcepts: [
          {
            heading: 'Concrete Workability & Slump Test',
            description:
              'Workability is the ease with which concrete can be mixed, placed, compacted, and finished without segregation or bleeding. Slump test uses standard Frustum Cone (10 cm top dia, 20 cm bottom dia, 30 cm height). Slump types: True slump (desirable), Shear slump (indicates lack of cohesion), Collapse slump (excess water).',
          },
        ],
        derivationsOrTheorems: [
          'Hydration reactions of cement: Bogue compounds (C3S - early strength, C2S - progressive long-term strength, C3A - flash setting, C4AF - hydration rate).',
        ],
        frequentExamQuestions: [
          {
            question: 'Explain the Slump test for determining workability of fresh concrete with cone dimensions and types of slump.',
            marks: 7,
            answerSummary:
              'Sketch slump cone, tamping rod (16 mm dia, 60 cm len), 4 layers of 25 strokes, measure vertical subsidence, classify True/Shear/Collapse.',
          },
        ],
      },
      {
        unitNumber: 2,
        unitTitle: 'Unit-II: Building Components & Structure Types',
        weightage: '20% (14 Marks)',
        summary:
          'Substructure and Superstructure, Foundations: shallow foundations (isolated footing, combined footing, strap, mat/raft footing) and deep foundations (pile, pier, caisson/well foundation), bearing capacity of soil, masonry: English bond vs Flemish bond in brickwork, lintels and arches, floors and roofs, and damp proof course (DPC).',
        keyFormulas: [
          'Terzaghi Ultimate Bearing Capacity of Strip Footing: q_u = c N_c + γ D_f N_q + 0.5 γ B N_γ',
          'Safe Bearing Capacity SBC = q_u / Factor of Safety (FOS usually 2.5 to 3).',
        ],
        keyConcepts: [
          {
            heading: 'English Bond vs Flemish Bond',
            description:
              'English Bond consists of alternating courses of headers and stretchers; queen closer inserted after quoin header; strongest bond in brick masonry. Flemish Bond consists of alternate headers and stretchers placed in the same course; more pleasing architectural elevation appearance, but requires skilled craftsmanship.',
          },
        ],
        derivationsOrTheorems: [
          'Settlement criteria and pressure bulb distribution below shallow footings.',
        ],
        frequentExamQuestions: [
          {
            question: 'Differentiate between Shallow and Deep foundations with sketches. When is a Pile foundation adopted?',
            marks: 7,
            answerSummary:
              'Depth D ≤ width B for shallow; D > B for deep; explain pile foundation when surface soil is weak, marshy, or high water table exists.',
          },
        ],
      },
      {
        unitNumber: 3,
        unitTitle: 'Unit-III: Surveying Principles & Linear Measurements',
        weightage: '20% (14 Marks)',
        summary:
          'Principles of surveying (Working from whole to part, Locating point by at least two independent measurements), classification of surveying, Chain surveying: accessories (ranging rods, arrows, pegs, offset rods, optical square), obstacles in chaining and ranging, Compass surveying: Prismatic compass vs Surveyor compass, Whole Circle Bearing (WCB) vs Reduced Bearing (RB), and local attraction detection and correction.',
        keyFormulas: [
          'Conversion of WCB to Quadrantal Bearing (QB): 0°-90° (N θ E), 90°-180° (S [180°-θ] E), 180°-270° (S [θ-180°] W), 270°-360° (N [360°-θ] W).',
        ],
        keyConcepts: [
          {
            heading: 'Fundamental Principles of Surveying',
            description:
              '1. Working from whole to part: Major control framework is established with high precision first, and minor details filled in later. Prevents accumulation of errors and localizes discrepancies. 2. Locating a new point by at least two independent reference measurements (two linear, two angular, or one linear and one angular).',
          },
          {
            heading: 'Local Attraction in Compass Surveying',
            description:
              'Disturbance of magnetic needle from true magnetic north caused by proximity of magnetic substances (steel structures, iron pipes, power lines). Condition: difference between Fore Bearing and Back Bearing of a line must be exactly 180°. If not 180°, local attraction exists at one or both stations.',
          },
        ],
        derivationsOrTheorems: [
          'Error adjustments in closed compass traverse using Bowditch Rule: Correction in latitude/departure = (Length of line / Perimeter) × Total error.',
        ],
        frequentExamQuestions: [
          {
            question: 'What is Local Attraction? How is it detected and eliminated in compass traversing? Solve a numerical problem.',
            marks: 7,
            answerSummary:
              'Check stations where FB - BB = 180° (unaffected stations), compute correct internal angles, adjust affected bearings sequentially.',
          },
        ],
      },
      {
        unitNumber: 4,
        unitTitle: 'Unit-IV: Levelling & Contour Mapping',
        weightage: '20% (14 Marks)',
        summary:
          'Definitions (Datum, Benchmark, Back Sight, Fore Sight, Intermediate Sight, Reduced Level, Change Point), Dumpy level and Tilting level, Levelling staff, Height of Instrument (H.I.) method vs Rise and Fall method, Contour lines: characteristics of contours, contour interval, horizontal equivalent, and interpolation and uses of contour maps (reservoir capacity, alignment of roads, intervisibility).',
        keyFormulas: [
          'H.I. Method: H.I. = Benchmark R.L. + B.S., R.L. = H.I. - F.S.',
          'Reservoir Capacity by Trapezoidal Formula: V = d [ (A1 + An)/2 + A2 + A3 + ... + A_{n-1} ]',
          'Prismoidal Formula: V = d/3 [ (A1 + An) + 4 (A2 + A4 + ...) + 2 (A3 + A5 + ...) ]',
        ],
        keyConcepts: [
          {
            heading: 'Characteristics of Contour Lines',
            description:
              '1. All points on a contour line have equal elevation. 2. Flat ground has widely spaced contours; steep slope has closely spaced contours; uniform slope has evenly spaced contours. 3. Concentric closed contours with higher elevation inside indicate a hill; lower inside indicate a pond/depression. 4. Contours never intersect or cross each other except in case of an overhanging cliff or cave.',
          },
        ],
        derivationsOrTheorems: [
          'Arithmetic check mathematical proof for Height of Instrument and Rise & Fall field tables.',
        ],
        frequentExamQuestions: [
          {
            question: 'Compare Height of Instrument method with Rise and Fall method of levelling. State 6 characteristics of contour lines.',
            marks: 7,
            answerSummary:
              'Tabulate comparison (Rise and Fall provides check on intermediate sights whereas H.I. does not), list contour properties with neat sketches.',
          },
        ],
      },
      {
        unitNumber: 5,
        unitTitle: 'Unit-V: Environmental Engineering & Sustainable Infrastructure',
        weightage: '20% (14 Marks)',
        summary:
          'Water supply engineering: per capita water demand, population forecasting methods (arithmetic increase, geometric increase, incremental increase), drinking water quality standards (WHO/BIS), water treatment flowchart (screening, aeration, coagulation, flocculation, sedimentation, filtration, disinfection/chlorination), rainwater harvesting, and green building principles.',
        keyFormulas: [
          'Arithmetic Increase Method: P_n = P_0 + n · x̄',
          'Geometric Increase Method: P_n = P_0 (1 + r/100)^n',
          'Incremental Increase Method: P_n = P_0 + n · x̄ + [n(n + 1)/2] · ȳ',
        ],
        keyConcepts: [
          {
            heading: 'Municipal Water Treatment Flowchart',
            description:
              'Raw river water -> Coarse and fine screens (debris removal) -> Aeration (removes odor, dissolved gases, Fe/Mn) -> Coagulation (Alum addition) -> Flocculation (gentle mechanical agitation) -> Rapid Sand Sedimentation -> Rapid Sand Filtration (sand, gravel media) -> Disinfection (Chlorination to destroy pathogens and maintain residual 0.2 ppm) -> Clean storage reservoir.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of population forecasting formulas from differential rate equations dP/dt = k.',
        ],
        frequentExamQuestions: [
          {
            question: 'Draw a complete layout flowchart of conventional municipal surface water treatment plant and explain the purpose of each unit.',
            marks: 7,
            answerSummary:
              'Schematic showing intake well, aeration fountain, chemical dosing alum chamber, clariflocculator, rapid gravity sand filter, and chlorinator.',
          },
        ],
      },
    ],
  },

  // 9. ENGINEERING GRAPHICS / DRAWING (ME-101)
  'sub-eng-graphics': {
    subjectId: 'sub-eng-graphics',
    subjectCode: 'ME-101',
    subjectName: 'Engineering Graphics/Drawing',
    shortDescription:
      'Drawing standards, scales, conics (ellipse, parabola, hyperbola), projections of points, straight lines, planes, regular solids, sections of solids, and isometric views.',
    textbook: 'Engineering Drawing by N.D. Bhatt / P.S. Gill',
    driveFolderUrl: OFFICIAL_FIRST_YEAR_DRIVE_LINK,
    totalPdfPages: '135 Pages · Full Unit Notes & Drawing Sheets',
    quickFormulas: [
      {
        title: 'Representative Fraction (R.F.)',
        formula: 'R.F. = Length of drawing / Actual length of object (in same units)',
        note: 'Length of scale = R.F. × Maximum distance to be measured.',
      },
      {
        title: 'Conic Sections Eccentricity (e)',
        formula: 'e = Distance of point from focus (SP) / Distance of point from directrix (PM)',
        note: 'e < 1: Ellipse; e = 1: Parabola; e > 1: Hyperbola.',
      },
      {
        title: 'Isometric Scale Ratio',
        formula: 'Isometric Length / True Length = cos(45°) / cos(30°) = √(2/3) ≈ 0.816',
        note: 'Isometric Length is 81.6% of actual true length. Isometric projection uses isometric scale; isometric view uses true scale.',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit-I: Drawing Standards, Scales & Conic Sections',
        weightage: '20% (14 Marks)',
        summary:
          'Bureau of Indian Standards (BIS SP-46) conventions, lines, lettering, dimensioning, Plain scales, Diagonal scales, Conic sections: construction of Ellipse, Parabola, and Hyperbola using General (Eccentricity) method, Concentric Circles method, and Rectangle/Oblong method, Cycloidal curves.',
        keyFormulas: [
          'R.F. = (Area on drawing / Actual area)^{1/2}',
        ],
        keyConcepts: [
          {
            heading: 'Diagonal Scale Construction',
            description:
              'Used to measure distances in three units (e.g., meters, decimeters, centimeters) or up to two decimal places based on principle of similar triangles where a line divided into 10 equal parts gives 1/10th divisions on the diagonal.',
          },
        ],
        derivationsOrTheorems: [
          'Eccentricity locus construction for parabola (e=1) and hyperbola (e=3/2).',
        ],
        frequentExamQuestions: [
          {
            question: 'Construct an ellipse by eccentricity method when distance between focus and directrix is 50 mm and eccentricity is 2/3. Draw tangent and normal.',
            marks: 7,
            answerSummary:
              'Draw directrix AB, axis VF, divide into 5 equal parts (VF=2 parts, VA=3 parts), erect verticals, swing arcs from focus, connect with smooth curve.',
          },
        ],
      },
      {
        unitNumber: 2,
        unitTitle: 'Unit-II: Orthographic Projections of Points & Lines',
        weightage: '20% (14 Marks)',
        summary:
          'Principles of projection, First angle projection vs Third angle projection, projections of points in all four quadrants, projections of straight lines inclined to one or both reference planes (HP and VP), determination of true length, true inclinations (θ, φ), apparent angles (α, β), and traces (HT and VT).',
        keyFormulas: [
          'Line inclined to both planes relation: cos² α + cos² β ≠ 1, but true angles satisfy cos² θ + cos² φ ≤ 1.',
          'Elevation length = TL cos θ; Plan length = TL cos φ.',
        ],
        keyConcepts: [
          {
            heading: 'First Angle vs Third Angle Projection',
            description:
              'First Angle (BIS standard): Object lies between observer and projection plane; Top view is drawn below Front view; Left side view is drawn on right side. Third Angle: Projection plane lies between observer and object; Top view is drawn above Front view; Left side view is drawn on left side.',
          },
        ],
        derivationsOrTheorems: [
          'Rotating line method for finding True Length and True Inclinations of straight line given its top and front views.',
        ],
        frequentExamQuestions: [
          {
            question: 'A line AB 75 mm long has end A 15 mm above HP and 20 mm in front of VP. The line is inclined at 30° to HP and 45° to VP. Draw projections and find apparent angles.',
            marks: 14,
            answerSummary:
              'Plot a\' and a, draw true length lines at 30° and 45°, project locus of b\' and b, rotate to obtain front view a\'b\' and top view ab.',
          },
        ],
      },
      {
        unitNumber: 3,
        unitTitle: 'Unit-III: Projections of Planes & Regular Solids',
        weightage: '20% (14 Marks)',
        summary:
          'Projections of regular planes (triangle, square, pentagon, hexagon, circle) inclined to one and both reference planes, projections of regular polyhedra and solids of revolution (prisms, pyramids, cylinders, cones) with axis inclined to HP and VP.',
        keyFormulas: [
          'Pentagon internal angle = 108°; Hexagon internal angle = 120°.',
        ],
        keyConcepts: [
          {
            heading: 'Three-Stage Projection Method for Solids',
            description:
              'Stage 1: Assume solid axis perpendicular to one reference plane to see true shape of base. Stage 2: Tilt the solid to satisfy condition of inclination of axis/face to the first plane. Stage 3: Tilt the solid to satisfy second condition of inclination with the second reference plane.',
          },
        ],
        derivationsOrTheorems: [
          'Projections of right circular cone inclined to HP resting on one of its generators.',
        ],
        frequentExamQuestions: [
          {
            question: 'Draw the projections of a regular hexagonal pyramid of base side 25 mm and axis 55 mm resting on one of its slant triangular faces on HP.',
            marks: 14,
            answerSummary:
              'Stage 1: Base on HP with one edge perpendicular to VP. Stage 2: Tilt front view so that slant face generator coincides with XY line. Stage 3: Project top view.',
          },
        ],
      },
      {
        unitNumber: 4,
        unitTitle: 'Unit-IV: Sections of Solids & Development of Surfaces',
        weightage: '20% (14 Marks)',
        summary:
          'Section planes (parallel, perpendicular, inclined to HP/VP), true shape of sections, development of lateral surfaces of prisms, cylinders (Parallel line method), pyramids, and cones (Radial line method).',
        keyFormulas: [
          'Cone surface development subtended angle: θ = (r / R) × 360° (where r = base radius, R = slant height).',
        ],
        keyConcepts: [
          {
            heading: 'Radial Line Method vs Parallel Line Method',
            description:
              'Parallel line method is used for prisms and cylinders where all lateral edges/generators are parallel in true length. Radial line method is used for pyramids and cones where all edges/generators converge to a common apex.',
          },
        ],
        derivationsOrTheorems: [
          'Derivation of subtended angle formula θ = (r / R) × 360° for cone development.',
        ],
        frequentExamQuestions: [
          {
            question: 'A cylinder of base diameter 50 mm and height 65 mm is cut by a section plane inclined at 45° to HP and bisecting axis. Draw true shape of section and lateral development.',
            marks: 14,
            answerSummary:
              'True shape of cut cylinder section is an ellipse; development is a rectangle of width πD = 157 mm with sinusoidal top boundary profile.',
          },
        ],
      },
      {
        unitNumber: 5,
        unitTitle: 'Unit-V: Isometric Views & CAD Basics',
        weightage: '20% (14 Marks)',
        summary:
          'Principles of isometric projection, isometric scale construction, isometric view vs isometric projection of planes, prisms, pyramids, cylinders, cones, and composite solids, introduction to CAD software (AutoCAD coordinate systems, 2D commands, layers, dimensioning).',
        keyFormulas: [
          'Isometric lines are lines parallel to isometric axes (inclined at 30° to horizontal).',
          'Four-Center Method: Used for constructing isometric view of a circle (which appears as an ellipse).',
        ],
        keyConcepts: [
          {
            heading: 'Four-Center Ellipse Construction in Isometric View',
            description:
              'Enclose isometric circle inside rhombus of side D. From obtuse angle vertices, draw perpendicular bisectors to opposite sides. Intersections define two small circle centers; obtuse corners define two large circle centers; connect with smooth compass arcs.',
          },
        ],
        derivationsOrTheorems: [
          'Geometric derivation of isometric scale reduction factor √(2/3) ≈ 0.816.',
        ],
        frequentExamQuestions: [
          {
            question: 'Draw the isometric view of a frustum of a square pyramid of bottom base 50 mm, top base 30 mm, and height 60 mm.',
            marks: 14,
            answerSummary:
              'Draw bottom square 50 mm in isometric at 30°, erect vertical axis 60 mm, center top square 30 mm, join corresponding corners with firm visible lines.',
          },
        ],
      },
    ],
  },

  // 10. ENGLISH FOR COMMUNICATION (HU-101)
  'sub-eng-comm': {
    subjectId: 'sub-eng-comm',
    subjectCode: 'HU-101',
    subjectName: 'English for Communication',
    shortDescription:
      'Communication theory, 7 Cs, business correspondence (emails, letters, resumes), technical reports, proposals, grammar, vocabulary, and GD/interview preparation.',
    textbook: 'Technical Communication: Principles and Practice by Meenakshi Raman & Sangeeta Sharma',
    driveFolderUrl: OFFICIAL_FIRST_YEAR_DRIVE_LINK,
    totalPdfPages: '124 Pages · Full Unit Notes',
    quickFormulas: [
      {
        title: 'The 7 Cs of Effective Communication',
        formula: 'Completeness, Conciseness, Consideration, Concreteness, Clarity, Courtesy, Correctness',
        note: 'Universal quality metrics for technical, executive, and business communications.',
      },
      {
        title: 'Communication Cycle Model',
        formula: 'Sender → Encoding → Channel/Message (Noise) → Decoding → Receiver → Feedback (loops back to Sender)',
        note: 'Communication is incomplete without measurable feedback from the receiver.',
      },
      {
        title: 'Structure of Technical Report',
        formula: 'Title Page → Executive Summary/Abstract → Table of Contents → Introduction → Methodology → Results/Discussion → Conclusions & Recommendations → References (IEEE Style)',
        note: 'Executive summary is written last but placed first for busy decision-makers.',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit-I: Fundamentals of Effective Communication',
        weightage: '20% (14 Marks)',
        summary:
          'Communication process and cycle, verbal and non-verbal communication (kinesics, proxemics, chronemics, paralanguage), barriers to communication (physical, psychological, linguistic, cultural), overcoming barriers, and the 7 Cs of communication.',
        keyFormulas: [
          'Non-verbal communication comprises >70% of human interaction perception (Mehrabian Rule: 7% words, 38% vocal tone, 55% facial/body posture).',
        ],
        keyConcepts: [
          {
            heading: 'Barriers to Communication & Remedies',
            description:
              'Physical barriers (noise, distance, faulty equipment); Semantic/Linguistic barriers (jargon, ambiguous words); Psychological barriers (prejudice, ego, selective perception). Remedies: active listening, simplified vocabulary, choosing proper medium, encouraging prompt constructive feedback.',
          },
        ],
        derivationsOrTheorems: [
          'Analysis of Shannon-Weaver communication mathematical model and noise entropy.',
        ],
        frequentExamQuestions: [
          {
            question: 'Explain the communication cycle with a neat diagram. Discuss any 4 major barriers to effective communication in engineering workplaces.',
            marks: 7,
            answerSummary:
              'Draw loop showing sender encoding idea into message, transmission through medium with noise interference, receiver decoding and sending feedback.',
          },
        ],
      },
      {
        unitNumber: 2,
        unitTitle: 'Unit-II: Technical & Professional Correspondence',
        weightage: '20% (14 Marks)',
        summary:
          'Business letters (inquiry, quotation, complaint, adjustment letters), formats of formal letters (Full block style), professional email etiquette (subject line, salutation, body paragraphs, sign-off), Resume vs Curriculum Vitae (CV), functional and chronological resumes, and customized cover letters.',
        keyFormulas: [
          'Full-Block Letter Layout: All elements (sender address, date, inside address, subject, salutation, body, sign-off) aligned strictly flush left without indentation.',
        ],
        keyConcepts: [
          {
            heading: 'Chronological vs Functional Resume',
            description:
              'Chronological Resume lists work experience and education in reverse chronological order (ideal for students with steady progression). Functional Resume highlights core technical skills, projects, and competencies over timeline gaps.',
          },
        ],
        derivationsOrTheorems: [
          'Writing high-impact bullet points using Action Verb + Technical Context + Measurable Result framework.',
        ],
        frequentExamQuestions: [
          {
            question: 'Draft a professional cover letter and chronological resume for a Junior Software Engineer position at a reputed IT firm.',
            marks: 14,
            answerSummary:
              'Structure letter with formal address, opening hook, alignment of tech stack with company needs, call to action; follow with modern 1-page resume.',
          },
        ],
      },
      {
        unitNumber: 3,
        unitTitle: 'Unit-III: Technical Reports & Proposal Drafting',
        weightage: '20% (14 Marks)',
        summary:
          'Types of technical reports (investigation, feasibility, progress, laboratory reports), structure and components of a formal engineering report, writing executive summaries and abstracts, drafting project proposals, citation styles (IEEE, APA), and avoiding plagiarism.',
        keyFormulas: [
          'IEEE Citation Format: [1] J. K. Author, "Title of paper," Abbrev. Title of Periodical, vol. x, no. x, pp. xxx-xxx, Month, Year.',
        ],
        keyConcepts: [
          {
            heading: 'Executive Summary vs Abstract',
            description:
              'An Abstract is a brief (~150-250 words) overview of research scope, methodology, and primary conclusion. An Executive Summary is a comprehensive self-contained document (~1-2 pages) written for non-technical executives containing problem statement, business justification, economic analysis, and actionable recommendations.',
          },
        ],
        derivationsOrTheorems: [
          'Criteria for technical proposal acceptance: Technical competence, Management capability, Cost feasibility.',
        ],
        frequentExamQuestions: [
          {
            question: 'What are the essential components of a formal technical project report? Write an executive summary for an engineering project.',
            marks: 7,
            answerSummary:
              'Detail Preliminaries (Title, Abstract, Contents), Main Body (Introduction, Design, Testing, Results), and Documentation (References, Appendices).',
          },
        ],
      },
      {
        unitNumber: 4,
        unitTitle: 'Unit-IV: Grammar, Syntax & Vocabulary Enhancement',
        weightage: '20% (14 Marks)',
        summary:
          'Subject-verb agreement rules, common grammatical errors in engineering writing, active vs passive voice in technical contexts, vocabulary building (prefixes, suffixes, technical jargon, collocations, idioms), and sentence transformation.',
        keyFormulas: [
          'Technical Writing Voice Rule: Use Passive voice for describing laboratory experiments and procedures (e.g., "The solution was heated to 80°C") to maintain objective neutrality.',
        ],
        keyConcepts: [
          {
            heading: 'Key Subject-Verb Agreement Rules',
            description:
              '1. Singular subjects joined by "and" take plural verb unless referring to single unit. 2. Words like "each", "everyone", "neither", "either" take singular verbs. 3. With "neither...nor" or "either...or", verb agrees with the nearer subject.',
          },
        ],
        derivationsOrTheorems: [
          'Syntax trees and conversion between complex and compound technical sentences.',
        ],
        frequentExamQuestions: [
          {
            question: 'Correct common subject-verb agreement errors in 5 given sentences and transform 5 active sentences into technical passive voice.',
            marks: 7,
            answerSummary:
              'Demonstrate agreement with collective nouns, intervening prepositional phrases, and impersonal passive construction.',
          },
        ],
      },
      {
        unitNumber: 5,
        unitTitle: 'Unit-V: Group Discussions, Presentations & Interview Skills',
        weightage: '20% (14 Marks)',
        summary:
          'Group Discussion (GD) dynamics, personality traits evaluated in GD (leadership, empathy, communication, content knowledge), roles in GD (initiator, moderator, summarizer), presentation skills (structuring slides, non-verbal cues, handling Q&A), and campus interview preparation (STAR technique for HR questions).',
        keyFormulas: [
          'STAR Technique for Interviews: Situation (set context) → Task (state challenge) → Action (describe specific steps taken) → Result (quantifiable outcome).',
        ],
        keyConcepts: [
          {
            heading: 'Do’s and Don’ts of Group Discussion',
            description:
              'Do’s: Initiate if knowledgeable, listen actively, acknowledge other speakers ("I agree with your point, and to add to it..."), maintain polite eye contact, summarize neutrally. Don’ts: Do not shout or dominate, do not interrupt aggressively, do not get emotional, do not look only at the moderator.',
          },
        ],
        derivationsOrTheorems: [
          'Audience analysis and 10-20-30 presentation rule (10 slides, 20 minutes, minimum 30 pt font).',
        ],
        frequentExamQuestions: [
          {
            question: 'Explain the STAR technique for answering behavioral interview questions with an engineering situation example.',
            marks: 7,
            answerSummary:
              'Break down Situation, Task, Action, Result with a real-world software debugging or laboratory project scenario demonstrating problem solving.',
          },
        ],
      },
    ],
  },
};

/**
 * Helper function to retrieve notes details for any subject.
 * Falls back to a structured synthetic syllabus if not explicitly in catalog.
 */
export function getSubjectNotesDetail(subjectId: string, subjectCode?: string, subjectName?: string): FirstYearSubjectNotesDetail {
  if (FIRST_YEAR_SUBJECT_NOTES_CATALOG[subjectId]) {
    return FIRST_YEAR_SUBJECT_NOTES_CATALOG[subjectId];
  }

  // Lookup by code or partial name
  const match = Object.values(FIRST_YEAR_SUBJECT_NOTES_CATALOG).find(
    (item) =>
      item.subjectCode.toLowerCase() === (subjectCode || '').toLowerCase() ||
      item.subjectName.toLowerCase().includes((subjectName || '').toLowerCase())
  );
  if (match) return match;

  // Generic fallback with Google Drive integration
  return {
    subjectId,
    subjectCode: subjectCode || 'ENG-101',
    subjectName: subjectName || 'Engineering Course',
    shortDescription: `Curated university study notes, handwritten PDFs, formulas, and previous year solved questions for ${subjectName || 'this subject'}.`,
    textbook: 'Standard Recommended University Reference Textbook',
    driveFolderUrl: OFFICIAL_FIRST_YEAR_DRIVE_LINK,
    totalPdfPages: '120+ Pages · Comprehensive Notes',
    quickFormulas: [
      {
        title: 'Core Governing Equation',
        formula: 'Σ Inputs = Σ Outputs + Storage / Losses',
        note: 'Fundamental engineering conservation law applicable across systems.',
      },
    ],
    units: [1, 2, 3, 4, 5].map((u) => ({
      unitNumber: u,
      unitTitle: `Unit-${u}: Core Modules & Theoretical Principles`,
      weightage: '20% (14 Marks)',
      summary: `In-depth syllabus notes, theoretical foundations, derivations, and practice questions for Unit ${u} of ${subjectName || 'this subject'}.`,
      keyFormulas: [`Key Formula Unit ${u}: E = h ν, F = m a, V = I R`],
      keyConcepts: [
        {
          heading: `Foundational Engineering Concepts of Unit ${u}`,
          description: `Detailed module breakdown covering core principles, computational analysis, and practical laboratory implications for ${subjectName || 'this subject'}.`,
        },
      ],
      derivationsOrTheorems: [`Standard mathematical derivation and proof for Unit ${u}.`],
      frequentExamQuestions: [
        {
          question: `Explain the fundamental concepts, governing equations, and practical applications of Unit ${u} for ${subjectName || 'this subject'}.`,
          marks: 7,
          answerSummary: `Comprehensive answer breakdown with step-by-step mathematical derivation and neat schematic diagrams.`,
        },
      ],
    })),
  };
}

/**
 * Converts catalog into SubjectFolderData format to enrich AppContext subjectFolders
 */
export function generateSubjectFolderDataFromCatalog(
  detail: FirstYearSubjectNotesDetail
): SubjectFolderData {
  return {
    subjectId: detail.subjectId,
    topperNotes: [
      {
        id: `${detail.subjectId}-topper-drive`,
        title: `${detail.subjectName} Complete Handwritten Topper Notes (All 5 Units)`,
        type: 'notes',
        dateAdded: 'Official Google Drive Repo',
        fileSizeOrPages: detail.totalPdfPages,
        summary: `Complete handwritten lecture and unit notes covering all 5 syllabus modules for ${detail.subjectName}. Sourced from official Google Drive repository.`,
        tags: ['All 5 Units', 'Topper Xerox', 'Drive PDF', 'Verified'],
      },
      ...detail.units.map((u) => ({
        id: `${detail.subjectId}-unit-${u.unitNumber}`,
        title: `${detail.subjectCode} ${u.unitTitle} Handwritten Notes`,
        type: 'notes' as const,
        dateAdded: 'Unit Notes PDF',
        fileSizeOrPages: '24-30 Pages · PDF',
        summary: u.summary,
        tags: [`Unit ${u.unitNumber}`, 'Exam Notes', 'Derivations'],
      })),
      {
        id: `${detail.subjectId}-formula-cheat`,
        title: `${detail.subjectName} Formula Cheat-Sheet & Last Night Prep`,
        type: 'notes',
        dateAdded: 'Exam Sprint',
        fileSizeOrPages: '8 Pages · Quick Revision',
        summary: `High yield formulas, key laws, and rapid recall summaries for ${detail.subjectName}.`,
        tags: ['Formulas', 'Quick Revision', 'High Yield'],
      },
    ],
    previousYearQuestions: [
      {
        id: `${detail.subjectId}-pyq-2024`,
        title: `University End-Sem 2024: ${detail.subjectCode} Paper (Solved)`,
        type: 'pyq',
        dateAdded: 'Dec 2024 Exam',
        fileSizeOrPages: 'Full Paper · With Model Solutions',
        summary: `Official end-semester question paper with model answers and marks distribution for ${detail.subjectCode}.`,
        tags: ['End-Sem 2024', 'Solved Answers'],
        solved: true,
      },
      {
        id: `${detail.subjectId}-pyq-repeated`,
        title: `Top 15 Most Repeated University Questions (Last 5 Years)`,
        type: 'pyq',
        dateAdded: 'Curated by Faculty',
        fileSizeOrPages: '12 Pages · Question Bank',
        summary: `High frequency recurring questions across all 5 units for ${detail.subjectCode}.`,
        tags: ['High Yield', 'Guaranteed Pass', 'Repeated'],
        solved: true,
      },
    ],
    labVivaQuestions: detail.units.flatMap((u, idx) =>
      u.frequentExamQuestions.map((q, qIdx) => ({
        id: `${detail.subjectId}-viva-${idx}-${qIdx}`,
        question: q.question,
        answer: q.answerSummary,
        importance: (qIdx === 0 ? 'Guaranteed Viva Question' : 'Frequent') as
          | 'Guaranteed Viva Question'
          | 'Frequent',
      }))
    ),
    assignments: [
      {
        id: `${detail.subjectId}-asg-1`,
        title: `Unit I & II Assignment Problem Set & Derivations`,
        dueDate: 'Next Monday, 4:30 PM',
        completed: false,
        maxMarks: 10,
      },
      {
        id: `${detail.subjectId}-asg-2`,
        title: `Unit III & IV Numerical Practice & Viva Preparation`,
        dueDate: 'Next Friday, 5:00 PM',
        completed: false,
        maxMarks: 10,
      },
    ],
  };
}
