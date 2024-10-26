var documenterSearchIndex = {"docs":
[{"location":"library/function_index/#main-index","page":"Function index","title":"Index","text":"","category":"section"},{"location":"library/function_index/","page":"Function index","title":"Function index","text":"Pages = [\"public.md\", \"internals.md\", \"function_index.md\"]","category":"page"},{"location":"library/outline/#Library-Outline","page":"Contents","title":"Library Outline","text":"","category":"section"},{"location":"library/outline/","page":"Contents","title":"Contents","text":"Pages = [\"public.md\", \"internals.md\", \"function_index.md\"]","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"EditURL = \"../../../examples/freezing_bucket.jl\"","category":"page"},{"location":"generated/freezing_bucket/#A-freezing-bucket","page":"Freezing bucket","title":"A freezing bucket","text":"","category":"section"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"A common laboratory experiment freezes an insultated bucket of water from the top down, using a metal lid to keep the top of the bucket at some constant, very cold temperature. In this example, we simulate such a scenario using SlabSeaIceModel. Here, the bucket is perfectly insulated and infinitely deep, like many buckets are: if the Simulation is run for longer, the ice will keep freezing, and freezing, and will never run out of water. Also, the water in the infinite bucket is (somehow) all at the same temperature, in equilibrium with the ice-water interface (and therefore fixed at the melting temperature). Yep, this kind of thing happens all the time.","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"We start by using Oceananigans to bring in functions for building grids and Simulations and the like.","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"using Oceananigans\nusing Oceananigans.Units","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"Next we using ClimaSeaIce to get some ice-specific names.","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"using ClimaSeaIce","category":"page"},{"location":"generated/freezing_bucket/#An-infinitely-deep-bucket-with-a-single-grid-point","page":"Freezing bucket","title":"An infinitely deep bucket with a single grid point","text":"","category":"section"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"Perhaps surprisingly, we need just one grid point to model an possibly infinitely thick slab of ice with SlabSeaIceModel. We would only need more than 1 grid point if our boundary conditions vary in the horizontal direction.","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"grid = RectilinearGrid(size=(), topology=(Flat, Flat, Flat))","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"Next, we build our model of an ice slab freezing into a bucket. We start by defining a constant internal ConductiveFlux with ice_conductivity","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"conductivity = 2 # kg m s⁻³ K⁻¹\ninternal_heat_flux = ConductiveFlux(; conductivity)","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"Note that other units besides Celsius can be used, but that requires setting model.phase_transitions` with appropriate parameters. We set the ice heat capacity and density as well,","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"ice_heat_capacity = 2100 # J kg⁻¹ K⁻¹\nice_density = 900 # kg m⁻³\nphase_transitions = PhaseTransitions(; ice_heat_capacity, ice_density)","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"We set the top ice temperature,","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"top_temperature = -10 # ᵒC\ntop_heat_boundary_condition = PrescribedTemperature(-10)","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"Then we assemble it all into a model,","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"model = SlabSeaIceModel(grid;\n                        internal_heat_flux,\n                        phase_transitions,\n                        top_heat_boundary_condition)","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"Note that the default bottom heat boundary condition for SlabSeaIceModel is IceWaterThermalEquilibrium with freshwater. That's what we want!","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"model.heat_boundary_conditions.bottom","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"Ok, we're ready to freeze the bucket for 10 straight days with an initial ice thickness of 1 cm,","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"simulation = Simulation(model, Δt=10minute, stop_time=10days)\n\nset!(model, h=0.01)","category":"page"},{"location":"generated/freezing_bucket/#Collecting-data-and-running-the-simulation","page":"Freezing bucket","title":"Collecting data and running the simulation","text":"","category":"section"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"Before simulating the freezing bucket, we set up a Callback to create a timeseries of the ice thickness saved at every time step.","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"# Container to hold the data\ntimeseries = []\n\n# Callback function to collect the data from the `sim`ulation\nfunction accumulate_timeseries(sim)\n    h = sim.model.ice_thickness\n    push!(timeseries, (time(sim), first(h)))\nend\n\n# Add the callback to `simulation`\nsimulation.callbacks[:save] = Callback(accumulate_timeseries)","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"Now we're ready to hit the Big Red Button (it should run pretty quick):","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"run!(simulation)","category":"page"},{"location":"generated/freezing_bucket/#Visualizing-the-result","page":"Freezing bucket","title":"Visualizing the result","text":"","category":"section"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"It'd be a shame to run such a \"cool\" simulation without looking at the results. We'll visualize it with Makie.","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"using CairoMakie","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"timeseries is a Vector of Tuple. So we have to do a bit of processing to build Vectors of time t and thickness h. It's not much work though:","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"t = [datum[1] for datum in timeseries]\nh = [datum[2] for datum in timeseries]","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"Just for fun, we also compute the velocity of the ice-water interface:","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"dhdt = @. (h[2:end] - h[1:end-1]) / simulation.Δt","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"All that's left, really, is to put those lines! in an Axis:","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"set_theme!(Theme(fontsize=24, linewidth=4))\n\nfig = Figure(resolution=(1200, 600))\n\naxh = Axis(fig[1, 1], xlabel=\"Time (days)\", ylabel=\"Ice thickness (cm)\")\naxd = Axis(fig[1, 2], xlabel=\"Ice thickness (cm)\", ylabel=\"Freezing rate (μm s⁻¹)\")\n\nlines!(axh, t ./ day, 1e2 .* h)\nlines!(axd, 1e2 .* h[1:end-1], 1e6 .* dhdt)\n\ncurrent_figure() # hide\nfig","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"If you want more ice, you can increase simulation.stop_time and run!(simulation) again (or just re-run the whole script).","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"","category":"page"},{"location":"generated/freezing_bucket/","page":"Freezing bucket","title":"Freezing bucket","text":"This page was generated using Literate.jl.","category":"page"},{"location":"library/internals/#Private-types-and-functions","page":"Private","title":"Private types and functions","text":"","category":"section"},{"location":"library/internals/","page":"Private","title":"Private","text":"Documentation for ClimaSeaIce.jl's internal interfaces.","category":"page"},{"location":"library/internals/#ClimaSeaIce","page":"Private","title":"ClimaSeaIce","text":"","category":"section"},{"location":"library/internals/","page":"Private","title":"Private","text":"Modules = [ClimaSeaIce]\nPublic = false","category":"page"},{"location":"library/internals/#ClimaSeaIce.LinearLiquidus","page":"Private","title":"ClimaSeaIce.LinearLiquidus","text":"LinearLiquidus(FT=Float64,\n               slope = 0.054, # psu / ᵒC\n               freshwater_melting_temperature = 0) # ᵒC\n\nReturn a linear model for the dependence of the melting temperature of saltwater on salinity,\n\nTₘ(S) = T₀ - m S \n\nwhere Tₘ(S) is the melting temperature as a function of salinity S, T₀ is the melting temperature of freshwater, and m is the ratio between the melting temperature and salinity (in other words the linear model should be thought of as defining m and could be written m  (T₀ - Tₘ)  S. The signs are arranged so that m  0 for saltwater).\n\nThe defaults assume that salinity is given in practical salinity units psu and temperature is in degrees Celsius.\n\nNote: the function melting_temperature(liquidus, salinity) returns the melting temperature given salinity.\n\n\n\n\n\n","category":"type"},{"location":"#ClimaSeaIce.jl","page":"Home","title":"ClimaSeaIce.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"~~Ocean~~ Sea ice component of CliMa's Earth system model.","category":"page"},{"location":"library/public/#Public-Documentation","page":"Public","title":"Public Documentation","text":"","category":"section"},{"location":"library/public/","page":"Public","title":"Public","text":"Documentation for ClimaSeaIce.jl's public interfaces.","category":"page"},{"location":"library/public/","page":"Public","title":"Public","text":"See the Internals section of the manual for internal package docs covering all submodules.","category":"page"},{"location":"library/public/#ClimaSeaIce","page":"Public","title":"ClimaSeaIce","text":"","category":"section"},{"location":"library/public/","page":"Public","title":"Public","text":"Modules = [ClimaSeaIce]\nPrivate = false","category":"page"},{"location":"library/public/#ClimaSeaIce.PhaseTransitions","page":"Public","title":"ClimaSeaIce.PhaseTransitions","text":"PhaseTransitions(FT=Float64,\n                 ice_density           = 917,   # kg m⁻³\n                 ice_heat_capacity     = 2000,  # J / (kg ᵒC)\n                 liquid_density        = 999.8, # kg m⁻³\n                 liquid_heat_capacity  = 4186,  # J / (kg ᵒC)\n                 reference_latent_heat = 334e3  # J kg⁻³\n                 liquidus = LinearLiquidus(FT)) # default assumes psu, ᵒC\n\nReturn a representation of transitions between the solid and liquid phases of salty water: in other words, the freezing and melting of sea ice.\n\nThe latent heat of fusion ℒ(T) (more simply just \"latent heat\") is a function of temperature T via\n\nρᵢ ℒ(T) = ρᵢ ℒ₀ + (ρℓ cℓ - ρᵢ cᵢ) * (T - T₀)    \n\nwhere ρᵢ is the ice_density, ρℓ is the liquid density, cᵢ is the heat capacity of ice, and cℓ is the heat capacity of liquid, and T₀ is a reference temperature, all of which are assumed constant.\n\nThe default liquidus assumes that salinity has practical salinity units (psu) and that temperature is degrees Celsius.\n\n\n\n\n\n","category":"type"}]
}
