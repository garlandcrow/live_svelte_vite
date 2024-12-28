defmodule LiveSvelte.MixProject do
  use Mix.Project

  @version "0.15.1"
  @repo_url "https://github.com/woutdp/live_svelte"

  def project do
    [
      app: :live_svelte,
      version: @version,
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),

      # Hex
      description: "E2E reactivity for Svelte and LiveView",
      package: package(),

      # Docs
      name: "LiveSvelte",
      docs: [
        name: "LiveSvelte",
        source_ref: "v#{@version}",
        source_url: @repo_url,
        homepage_url: @repo_url,
        main: "readme",
        extras: ["README.md"],
        links: %{
          "GitHub" => @repo_url,
          "Sponsor" => "https://github.com/sponsors/woutdp"
        }
      ]
    ]
  end

  defp package() do
    [
      maintainers: ["Wout De Puysseleir"],
      licenses: ["MIT"],
      links: %{
        Changelog: @repo_url <> "/blob/master/CHANGELOG.md",
        GitHub: @repo_url
      },
      files:
        ~w(priv assets/copy assets/js lib mix.exs package.json .formatter.exs LICENSE.md README.md CHANGELOG.md)
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    conditionals =
      case Application.get_env(:live_svelte, :ssr_module) do
        # Needed to use :httpc.request
        LiveSvelte.SSR.ViteJS -> [:inets]
        _ -> []
      end

    [
      extra_applications: [:logger] ++ conditionals
    ]
  end

  defp deps do
    [
      {:ex_doc, "~> 0.19", only: :dev, runtime: false},
      {:jason, "~> 1.2"},
      {:nodejs, "~> 3.1"},
      {:phoenix, ">= 1.7.0"},
      {:phoenix_html, ">= 3.3.1"},
      {:phoenix_live_view, ">= 0.18.0"}
    ]
  end

  defp aliases do
    [
      setup: ["deps.get", "cmd npm install"],
      "assets.build": ["cmd npm run build"],
      "assets.watch": ["cmd npm run dev"]
    ]
  end
end
