{
  description = "syntax highlighting for Typst via highlightjs";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/release-26.05";
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs.nixpkgs-lib.follows = "nixpkgs";
    };
    devenv = {
      url = "github:cachix/devenv";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.flake-parts.follows = "flake-parts";
    };
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    { flake-parts, ... }@inputs:
    flake-parts.lib.mkFlake { inherit inputs; } (
      top@{
        config,
        withSystem,
        moduleWithSystem,
        ...
      }:
      {
        imports = [
          inputs.devenv.flakeModule
          inputs.treefmt-nix.flakeModule
        ];
        systems = [ "x86_64-linux" ];
        flake = {
        };
        perSystem = { ... }: {
          devenv.shells.default = {
            languages.javascript = {
              enable = true;
              npm = {
                enable = true;
                install.enable = true;
              };
            };
          };

          treefmt = {
            programs.nixfmt.enable = true;
            programs.prettier = {
              enable = true;
              includes = [
                "*.js"
                "*.md"
              ];
            };
            programs.typstyle.enable = true;
          };
        };
      }
    );
}
