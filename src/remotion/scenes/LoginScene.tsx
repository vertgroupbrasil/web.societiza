import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from 'remotion';

export const LoginScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftSlide = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 100,
    },
  });

  const emailTyping = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const passwordTyping = interpolate(frame, [80, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const buttonClick = spring({
    frame: frame - 120,
    fps,
    config: {
      damping: 100,
      stiffness: 300,
    },
  });

  const email = 'usuario@contabilidade.com.br';
  const password = '••••••••••';
  const emailChars = Math.floor(emailTyping * email.length);
  const passwordChars = Math.floor(passwordTyping * password.length);

  return (
    <AbsoluteFill
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
      }}
    >
      {/* Left Side - Login Form */}
      <div
        style={{
          flex: 1,
          background: 'hsl(var(--background))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
          transform: `translateX(${interpolate(leftSlide, [0, 1], [-100, 0])}px)`,
          opacity: leftSlide,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 480,
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
          }}
        >
          {/* Logo and Title */}
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 'bold',
                color: 'hsl(var(--foreground))',
              }}
            >
              Iniciar sessão no meu societário
            </div>
            <div
              style={{
                fontSize: 18,
                color: 'hsl(var(--muted-foreground))',
                lineHeight: 1.5,
              }}
            >
              Esqueça as milhares de planilhas e se concentre em uma plataforma
              só.
            </div>
          </div>

          {/* Form */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 25,
            }}
          >
            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: 'hsl(var(--foreground))',
                }}
              >
                Email
              </div>
              <div
                style={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  padding: '12px 16px',
                  fontSize: 16,
                  fontFamily: 'monospace',
                  minHeight: 48,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'hsl(var(--foreground))',
                }}
              >
                <span style={{ marginRight: 8, opacity: 0.5 }}>✉️</span>
                {email.substring(0, emailChars)}
                {emailChars > 0 && emailChars < email.length && (
                  <span style={{ marginLeft: 2 }}>|</span>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: 'hsl(var(--foreground))',
                }}
              >
                Senha
              </div>
              <div
                style={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  padding: '12px 16px',
                  fontSize: 16,
                  fontFamily: 'monospace',
                  minHeight: 48,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'hsl(var(--foreground))',
                }}
              >
                {password.substring(0, passwordChars)}
                {passwordChars > 0 && passwordChars < password.length && (
                  <span style={{ marginLeft: 2 }}>|</span>
                )}
              </div>
            </div>

            {/* Login Button */}
            {buttonClick > 0 && (
              <div
                style={{
                  background: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  borderRadius: 8,
                  padding: '14px 20px',
                  fontSize: 18,
                  fontWeight: 600,
                  textAlign: 'center',
                  transform: `scale(${interpolate(buttonClick, [0, 1], [1, 0.97])})`,
                  opacity: buttonClick,
                }}
              >
                Entrar
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          padding: 20,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 100,
            opacity: 0.3,
          }}
        >
          📊
        </div>
      </div>
    </AbsoluteFill>
  );
};
