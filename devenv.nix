{ pkgs, lib, config, inputs, ... }:

{
  services = {
    mailhog.enable = true;
  };
}
