defmodule Remnant.Repo do
  use Ecto.Repo,
    otp_app: :remnant,
    adapter: Ecto.Adapters.Postgres
end
