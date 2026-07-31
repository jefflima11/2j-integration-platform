#define MyAppName "API 2J Systems - Simulação"
#define MyAppVersion "3.0.20"
#define MyAppPublisher "2J Systems"

[Setup]
AppId={{API-2J-SYSTEMS-SML}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}

DefaultDirName={autopf}\2J Systems - api\sml
DefaultGroupName={#MyAppName}

OutputDir=Output
OutputBaseFilename=api-2j-systems-sml-{#MyAppVersion}-setup

Compression=lzma2
SolidCompression=yes
WizardStyle=modern

PrivilegesRequired=admin

ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

VersionInfoVersion={#MyAppVersion}
VersionInfoCompany={#MyAppPublisher}
VersionInfoDescription={#MyAppName}
VersionInfoProductName={#MyAppName}

[Dirs]
Name: "{app}\temp"
Name: "{app}\uploads"
Name: "{app}\logs"

[Files]
Source: "..\..\dist\sml\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Run]

; Instala ou atualiza o serviço
Filename: "{app}\2j-system-api-service-sml.exe"; Parameters: "install"; Flags: runhidden waituntilterminated

; Inicia o serviço
Filename: "{cmd}"; Parameters: "/C sc start api-2j-sml"; Flags: runhidden waituntilterminated

; Libera porta da API
Filename: "{cmd}"; Parameters: "/C netsh advfirewall firewall add rule name=""2J API - Simulação"" dir=in action=allow protocol=TCP localport=4030"; Flags: runhidden waituntilterminated


[UninstallRun]

; Para o serviço
Filename: "{cmd}"; Parameters: "/C sc stop api-2j-sml"; Flags: runhidden waituntilterminated skipifdoesntexist

; Remove serviço
Filename: "{app}\2j-system-api-service-sml.exe"; Parameters: "uninstall"; Flags: runhidden waituntilterminated skipifdoesntexist

; Remove regra firewall
Filename: "{cmd}"; Parameters: "/C netsh advfirewall firewall delete rule name=""2J API - Simulação"""; Flags: runhidden waituntilterminated


[Code]

function PrepareToInstall(var NeedsRestart: Boolean): String;
var
  ResultCode: Integer;
begin

  { Para o serviço antes da atualização }
  Exec(
    ExpandConstant('{cmd}'),
    '/C sc stop api-2j-sml',
    '',
    SW_HIDE,
    ewWaitUntilTerminated,
    ResultCode
  );

  Result := '';

end;