import { IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function KillButton({
  onKill,
}: {
  onKill: () => void;
}) {
  return (
    <Tooltip title="Kill process">
      <IconButton
        size="small"
        className="danger"
        onClick={onKill}
        aria-label="Kill process"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
