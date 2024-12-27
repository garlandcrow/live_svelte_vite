defmodule Remnant.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {NodeJS.Supervisor, [path: LiveSvelte.SSR.NodeJS.server_path(), pool_size: 4]},
      RemnantWeb.Telemetry,
      Remnant.Repo,
      {DNSCluster, query: Application.get_env(:remnant, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Remnant.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Remnant.Finch},
      # Start a worker by calling: Remnant.Worker.start_link(arg)
      # {Remnant.Worker, arg},
      # Start to serve requests, typically the last entry
      RemnantWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Remnant.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    RemnantWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
